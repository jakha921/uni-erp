"""Student serializers — matches frontend Student, StudentListItem, CreateStudentDto interfaces."""

from rest_framework import serializers

from apps.core.models import Group

from .models import Student


def code_name(code: str, choices: list) -> dict:
    label = dict(choices).get(code, code)
    return {"code": code, "name": label}


class StudentListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    fullName = serializers.SerializerMethodField()
    shortName = serializers.SerializerMethodField()
    studentIdNumber = serializers.CharField(source="student_id_number")
    faculty = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()
    course = serializers.IntegerField()
    status = serializers.CharField()
    avgGrade = serializers.DecimalField(source="avg_grade", max_digits=5, decimal_places=2)
    image = serializers.SerializerMethodField()
    paymentForm = serializers.SerializerMethodField()
    educationForm = serializers.SerializerMethodField()

    def get_fullName(self, obj: Student) -> str:
        return obj.user.full_name

    def get_shortName(self, obj: Student) -> str:
        u = obj.user
        first = u.first_name[:1] + "." if u.first_name else ""
        return f"{u.last_name} {first}".strip()

    def get_faculty(self, obj: Student) -> dict:
        f = obj.group.specialty.department.faculty
        return {"id": f.id, "name": f.name, "code": f.code}

    def get_group(self, obj: Student) -> dict:
        g = obj.group
        active_count = g.students.filter(is_deleted=False, status="active").count()
        return {
            "id": g.id,
            "name": g.name,
            "code": g.name,
            "specialtyId": g.specialty_id,
            "course": g.course,
            "capacity": g.max_students,
            "currentCount": active_count,
        }

    def get_paymentForm(self, obj: Student) -> dict:
        return code_name(obj.payment_form, Student.PAYMENT_FORM_CHOICES)

    def get_educationForm(self, obj: Student) -> dict:
        return code_name(obj.education_form, Student.EDUCATION_FORM_CHOICES)

    def get_image(self, obj: Student) -> str | None:
        if obj.user.avatar:
            return obj.user.avatar.url
        return None


class StudentDetailSerializer(StudentListSerializer):
    firstName = serializers.SerializerMethodField()
    secondName = serializers.SerializerMethodField()
    thirdName = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    birthDate = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    specialty = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    educationType = serializers.SerializerMethodField()
    educationYear = serializers.SerializerMethodField()
    address = serializers.CharField()
    phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    passport = serializers.CharField()
    pinfl = serializers.CharField()
    createdAt = serializers.SerializerMethodField()

    def get_firstName(self, obj: Student) -> str:
        return obj.user.first_name

    def get_secondName(self, obj: Student) -> str:
        return obj.user.last_name

    def get_thirdName(self, obj: Student) -> str:
        return obj.user.middle_name

    def get_gender(self, obj: Student) -> dict:
        return code_name(obj.gender or "male", Student.GENDER_CHOICES)

    def get_birthDate(self, obj: Student) -> str | None:
        return str(obj.birth_date) if obj.birth_date else None

    def get_department(self, obj: Student) -> dict:
        d = obj.group.specialty.department
        return {"id": d.id, "name": d.name, "code": d.code, "facultyId": d.faculty_id}

    def get_specialty(self, obj: Student) -> dict:
        s = obj.group.specialty
        return {"id": s.id, "name": s.name, "code": s.code, "departmentId": s.department_id}

    def get_level(self, obj: Student) -> dict:
        return code_name(obj.level, Student.LEVEL_CHOICES)

    def get_educationType(self, obj: Student) -> dict:
        return code_name(obj.education_type, Student.PAYMENT_FORM_CHOICES)

    def get_educationYear(self, obj: Student) -> str:
        year = obj.enrollment_date.year if obj.enrollment_date else 2025
        return f"{year}-{year + 1}"

    def get_phone(self, obj: Student) -> str:
        return obj.user.phone

    def get_email(self, obj: Student) -> str:
        return obj.user.email or ""

    def get_createdAt(self, obj: Student) -> str:
        return obj.created_at.isoformat()


class CreateStudentSerializer(serializers.Serializer):
    firstName = serializers.CharField()
    secondName = serializers.CharField()
    thirdName = serializers.CharField(required=False, default="")
    gender = serializers.ChoiceField(choices=["male", "female"])
    birthDate = serializers.DateField()
    groupId = serializers.IntegerField()
    level = serializers.ChoiceField(choices=["bakalavr", "magistr"], default="bakalavr")
    educationForm = serializers.ChoiceField(choices=["kunduzgi", "sirtqi", "kechki"])
    educationType = serializers.ChoiceField(choices=["kontrakt", "grant"])
    paymentForm = serializers.ChoiceField(choices=["kontrakt", "grant"])
    phone = serializers.CharField()
    email = serializers.EmailField(required=False, default="")
    passport = serializers.CharField(required=False, default="")
    pinfl = serializers.CharField(required=False, default="")
    address = serializers.CharField(required=False, default="")

    def validate_groupId(self, value: int) -> int:
        if not Group.objects.filter(id=value).exists():
            raise serializers.ValidationError("Guruh topilmadi.")
        return value

    def create(self, validated_data: dict) -> Student:
        from apps.accounts.models import User

        group = Group.objects.select_related("specialty__department__faculty").get(
            id=validated_data["groupId"]
        )
        count = Student.objects.count() + 1
        student_id = f"ST-{validated_data['birthDate'].year}-{count:04d}"

        user = User.objects.create_user(
            phone=validated_data["phone"],
            password="changeme123",
            first_name=validated_data["firstName"],
            last_name=validated_data["secondName"],
            middle_name=validated_data.get("thirdName", ""),
            email=validated_data.get("email", ""),
        )
        return Student.objects.create(
            user=user,
            student_id_number=student_id,
            group=group,
            course=group.course,
            level=validated_data.get("level", "bakalavr"),
            education_type=validated_data["educationType"],
            payment_form=validated_data["paymentForm"],
            education_form=validated_data.get("educationForm", "kunduzgi"),
            enrollment_date=validated_data["birthDate"],
            birth_date=validated_data["birthDate"],
            gender=validated_data["gender"],
            passport=validated_data.get("passport", ""),
            pinfl=validated_data.get("pinfl", ""),
            address=validated_data.get("address", ""),
        )


class UpdateStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "course",
            "level",
            "education_type",
            "payment_form",
            "education_form",
            "status",
            "address",
            "passport",
            "pinfl",
        ]
        extra_kwargs = {f: {"required": False} for f in fields}
