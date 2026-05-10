from rest_framework import serializers

from apps.accounts.models import User, UserRole


class SystemUserSerializer(serializers.ModelSerializer):
    roles = serializers.SerializerMethodField()
    fullName = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "fullName",
            "phone",
            "email",
            "is_active",
            "last_login",
            "date_joined",
            "roles",
        ]

    def get_fullName(self, obj):
        return obj.get_full_name()

    def get_roles(self, obj):
        return list(
            UserRole.objects.filter(user=obj).values("id", "role", "faculty_id", "department_id")
        )


class SystemUserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "phone", "email", "password"]

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AuditLogSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    userName = serializers.SerializerMethodField()
    action = serializers.CharField()
    model = serializers.CharField()
    object_id = serializers.CharField()
    object_repr = serializers.CharField()
    path = serializers.CharField()
    ip_address = serializers.CharField()
    timestamp = serializers.DateTimeField()

    def get_userName(self, obj):
        return str(obj.user) if obj.user else ""
