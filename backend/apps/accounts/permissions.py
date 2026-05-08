"""DRF permission classes for role-based access control."""

from typing import Any

from rest_framework.permissions import BasePermission
from rest_framework.request import Request
from rest_framework.views import APIView

MODULE_ACCESS: dict[str, list[str]] = {
    "dashboard": ["admin", "buxgalter", "dekan", "oqituvchi", "talaba"],
    "students": ["admin", "buxgalter", "dekan", "oqituvchi"],
    "finance": ["admin", "buxgalter"],
    "hr": ["admin", "dekan"],
    "education": ["admin", "dekan", "oqituvchi"],
    "crm": ["admin"],
    "system": ["admin"],
    "core": ["admin", "buxgalter", "dekan", "oqituvchi"],
}


def get_primary_role(user: Any) -> str:
    role_obj = user.roles.filter(is_primary=True).first()
    return role_obj.role if role_obj else "talaba"


class IsAdmin(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and get_primary_role(request.user) == "admin"
        )


class IsBuxgalter(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and get_primary_role(request.user) in ("admin", "buxgalter")
        )


class IsDekan(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and get_primary_role(request.user) in ("admin", "dekan")
        )


class IsOqituvchi(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(
            request.user
            and request.user.is_authenticated
            and get_primary_role(request.user) in ("admin", "oqituvchi")
        )


class IsTalaba(BasePermission):
    def has_permission(self, request: Request, view: APIView) -> bool:
        return bool(request.user and request.user.is_authenticated)


class HasModuleAccess(BasePermission):
    """Parameterised permission: HasModuleAccess('students')."""

    def __init__(self, module: str) -> None:
        self.module = module

    def has_permission(self, request: Request, view: APIView) -> bool:
        if not (request.user and request.user.is_authenticated):
            return False
        role = get_primary_role(request.user)
        if role == "admin":
            return True
        return role in MODULE_ACCESS.get(self.module, [])

    # DRF calls __call__() which creates a new instance — support factory pattern
    def __call__(self) -> "HasModuleAccess":
        return self
