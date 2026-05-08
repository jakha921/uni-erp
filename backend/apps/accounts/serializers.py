"""Accounts serializers — Login, User (matches frontend User interface), TokenRefresh."""

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import User, UserRole


class LoginSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        phone = attrs["phone"]
        password = attrs["password"]
        user = authenticate(request=self.context.get("request"), phone=phone, password=password)
        if not user:
            raise serializers.ValidationError("Telefon raqam yoki parol noto'g'ri.")
        if not user.is_active:
            raise serializers.ValidationError("Foydalanuvchi bloklangan.")
        attrs["user"] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """Serializes User to match the frontend User interface exactly."""

    name = serializers.SerializerMethodField()
    initials = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    facultyId = serializers.SerializerMethodField()
    facultyName = serializers.SerializerMethodField()
    departmentId = serializers.SerializerMethodField()
    departmentName = serializers.SerializerMethodField()
    employeeId = serializers.SerializerMethodField()
    studentId = serializers.SerializerMethodField()
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "name",
            "initials",
            "email",
            "phone",
            "role",
            "facultyId",
            "facultyName",
            "departmentId",
            "departmentName",
            "employeeId",
            "studentId",
            "avatar",
        ]

    def _primary_role(self, user: User) -> UserRole | None:
        return user.roles.filter(is_primary=True).select_related("faculty", "department").first()

    def get_name(self, user: User) -> str:
        return user.full_name or user.phone

    def get_initials(self, user: User) -> str:
        return user.initials

    def get_role(self, user: User) -> str:
        role_obj = self._primary_role(user)
        return role_obj.role if role_obj else "talaba"

    def get_facultyId(self, user: User) -> int | None:
        role_obj = self._primary_role(user)
        return role_obj.faculty_id if role_obj else None

    def get_facultyName(self, user: User) -> str | None:
        role_obj = self._primary_role(user)
        return role_obj.faculty.name if role_obj and role_obj.faculty else None

    def get_departmentId(self, user: User) -> int | None:
        role_obj = self._primary_role(user)
        return role_obj.department_id if role_obj else None

    def get_departmentName(self, user: User) -> str | None:
        role_obj = self._primary_role(user)
        return role_obj.department.name if role_obj and role_obj.department else None

    def get_employeeId(self, user: User) -> int | None:
        try:
            return user.employee_profile.id
        except Exception:
            return None

    def get_studentId(self, user: User) -> int | None:
        try:
            return user.student_profile.id
        except Exception:
            return None

    def get_avatar(self, user: User) -> str | None:
        if user.avatar:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(user.avatar.url)
            return user.avatar.url
        return None


class UserListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    phone = serializers.CharField()
    firstName = serializers.CharField(source="first_name")
    lastName = serializers.CharField(source="last_name")
    fullName = serializers.CharField(source="full_name")
    email = serializers.EmailField()
    isActive = serializers.BooleanField(source="is_active")
    role = serializers.SerializerMethodField()
    createdAt = serializers.DateTimeField(source="date_joined")

    def get_role(self, obj: User) -> str:
        role_obj = obj.roles.filter(is_primary=True).first()
        return role_obj.role if role_obj else ""


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRole
        fields = ["id", "user", "role", "faculty", "department", "is_primary"]


class CreateUserSerializer(serializers.Serializer):
    phone = serializers.CharField()
    firstName = serializers.CharField()
    lastName = serializers.CharField()
    thirdName = serializers.CharField(required=False, default="")
    email = serializers.EmailField(required=False, default="")
    password = serializers.CharField(write_only=True, default="changeme123")
    role = serializers.ChoiceField(
        choices=["admin", "buxgalter", "dekan", "oqituvchi", "talaba"], default="talaba"
    )
    facultyId = serializers.IntegerField(required=False, allow_null=True)
    departmentId = serializers.IntegerField(required=False, allow_null=True)

    def create(self, validated_data: dict) -> User:
        user = User.objects.create_user(
            phone=validated_data["phone"],
            password=validated_data.get("password", "changeme123"),
            first_name=validated_data["firstName"],
            last_name=validated_data["lastName"],
            middle_name=validated_data.get("thirdName", ""),
            email=validated_data.get("email", ""),
        )
        UserRole.objects.create(
            user=user,
            role=validated_data.get("role", "talaba"),
            faculty_id=validated_data.get("facultyId"),
            department_id=validated_data.get("departmentId"),
            is_primary=True,
        )
        return user
