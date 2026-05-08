"""HR serializers — Employee, Order, Leave, Dashboard."""

from datetime import date

from rest_framework import serializers

from .models import Employee, HrOrder, Leave


def code_name(code: str, choices: list) -> dict:
    return {"code": code, "name": dict(choices).get(code, code)}


class EmployeeListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    employeeIdNumber = serializers.CharField(source="employee_id_number")
    fullName = serializers.SerializerMethodField()
    shortName = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    position = serializers.SerializerMethodField()
    academicDegree = serializers.SerializerMethodField()
    academicRank = serializers.SerializerMethodField()
    status = serializers.CharField()
    image = serializers.SerializerMethodField()

    def get_fullName(self, obj: Employee) -> str:
        return obj.user.full_name

    def get_shortName(self, obj: Employee) -> str:
        u = obj.user
        first = u.first_name[:1] + "." if u.first_name else ""
        return f"{u.last_name} {first}".strip()

    def get_department(self, obj: Employee) -> dict | None:
        if not obj.department:
            return None
        d = obj.department
        return {
            "id": d.id,
            "name": d.name,
            "code": d.code,
            "type": "kafedra",
            "parentId": d.faculty_id,
            "headId": None,
            "headName": None,
            "employeeCount": d.employees.filter(is_deleted=False).count(),
        }

    def get_position(self, obj: Employee) -> dict:
        return {"code": obj.position_code or "teacher", "name": obj.position}

    def get_academicDegree(self, obj: Employee) -> dict:
        return code_name(obj.academic_degree or "", Employee.DEGREE_CHOICES)

    def get_academicRank(self, obj: Employee) -> dict:
        return code_name(obj.academic_rank or "", Employee.RANK_CHOICES)

    def get_image(self, obj: Employee) -> str | None:
        if obj.user.avatar:
            return obj.user.avatar.url
        return None


class EmployeeDetailSerializer(EmployeeListSerializer):
    firstName = serializers.SerializerMethodField()
    secondName = serializers.SerializerMethodField()
    thirdName = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    birthDate = serializers.SerializerMethodField()
    employmentForm = serializers.SerializerMethodField()
    hireDate = serializers.SerializerMethodField()
    contractDate = serializers.SerializerMethodField()
    contractNumber = serializers.CharField(source="contract_number")
    phone = serializers.SerializerMethodField()
    email = serializers.SerializerMethodField()
    passport = serializers.CharField()
    pinfl = serializers.CharField()
    salary = serializers.DecimalField(max_digits=12, decimal_places=2)
    experience = serializers.SerializerMethodField()

    def get_firstName(self, obj: Employee) -> str:
        return obj.user.first_name

    def get_secondName(self, obj: Employee) -> str:
        return obj.user.last_name

    def get_thirdName(self, obj: Employee) -> str:
        return obj.user.middle_name

    def get_gender(self, obj: Employee) -> dict:
        return code_name(obj.gender or "male", Employee.GENDER_CHOICES)

    def get_birthDate(self, obj: Employee) -> str | None:
        return str(obj.birth_date) if obj.birth_date else None

    def get_employmentForm(self, obj: Employee) -> dict:
        return code_name(obj.employment_form, Employee.EMPLOYMENT_FORM_CHOICES)

    def get_hireDate(self, obj: Employee) -> str:
        return str(obj.hire_date)

    def get_contractDate(self, obj: Employee) -> str | None:
        return str(obj.contract_date) if obj.contract_date else None

    def get_phone(self, obj: Employee) -> str:
        return obj.user.phone

    def get_email(self, obj: Employee) -> str:
        return obj.user.email or ""

    def get_experience(self, obj: Employee) -> dict:
        delta = date.today() - obj.hire_date
        years = delta.days // 365
        months = (delta.days % 365) // 30
        return {"years": years, "months": months}


class CreateEmployeeSerializer(serializers.Serializer):
    firstName = serializers.CharField()
    secondName = serializers.CharField()
    thirdName = serializers.CharField(required=False, default="")
    gender = serializers.ChoiceField(choices=["male", "female"])
    birthDate = serializers.DateField()
    departmentId = serializers.IntegerField(required=False, allow_null=True)
    position = serializers.CharField()
    positionCode = serializers.CharField(required=False, default="")
    academicDegree = serializers.CharField(required=False, default="")
    academicRank = serializers.CharField(required=False, default="")
    employmentForm = serializers.ChoiceField(
        choices=["asosiy", "orindosh", "soatbay"], default="asosiy"
    )
    hireDate = serializers.DateField()
    phone = serializers.CharField()
    salary = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)

    def create(self, validated_data: dict) -> Employee:
        from apps.accounts.models import User
        from apps.core.models import Department

        count = Employee.objects.count() + 1
        user = User.objects.create_user(
            phone=validated_data["phone"],
            password="changeme123",
            first_name=validated_data["firstName"],
            last_name=validated_data["secondName"],
            middle_name=validated_data.get("thirdName", ""),
        )
        dept = None
        if validated_data.get("departmentId"):
            dept = Department.objects.filter(id=validated_data["departmentId"]).first()
        return Employee.objects.create(
            user=user,
            employee_id_number=f"EMP-{count:04d}",
            department=dept,
            position=validated_data["position"],
            position_code=validated_data.get("positionCode", ""),
            academic_degree=validated_data.get("academicDegree", ""),
            academic_rank=validated_data.get("academicRank", ""),
            employment_form=validated_data.get("employmentForm", "asosiy"),
            hire_date=validated_data["hireDate"],
            birth_date=validated_data["birthDate"],
            gender=validated_data["gender"],
            salary=validated_data.get("salary", 0),
        )


class OrderSerializer(serializers.ModelSerializer):
    employeeName = serializers.SerializerMethodField()

    class Meta:
        model = HrOrder
        fields = [
            "id",
            "number",
            "type",
            "title",
            "employee",
            "employeeName",
            "date",
            "effective_date",
            "signer",
            "basis",
            "status",
            "created_at",
        ]

    def get_employeeName(self, obj: HrOrder) -> str:
        return obj.employee.user.full_name


class LeaveSerializer(serializers.ModelSerializer):
    employeeName = serializers.SerializerMethodField()

    class Meta:
        model = Leave
        fields = [
            "id",
            "employee",
            "employeeName",
            "type",
            "start_date",
            "end_date",
            "days",
            "destination",
            "reason",
            "status",
            "created_at",
        ]

    def get_employeeName(self, obj: Leave) -> str:
        return obj.employee.user.full_name
