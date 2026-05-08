"""Accounts admin — User and UserRole with Unfold."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from unfold.admin import ModelAdmin, TabularInline

from .models import User, UserRole


class UserRoleInline(TabularInline):
    model = UserRole
    extra = 1
    fields = ["role", "faculty", "department", "is_primary"]


@admin.register(User)
class UserAdmin(ModelAdmin, BaseUserAdmin):
    list_display = ["phone", "full_name", "branch", "is_active", "is_staff"]
    list_filter = ["is_active", "is_staff", "branch"]
    search_fields = ["phone", "first_name", "last_name"]
    ordering = ["last_name", "first_name"]
    inlines = [UserRoleInline]

    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        (
            "Shaxsiy ma'lumot",
            {"fields": ("first_name", "last_name", "middle_name", "avatar", "branch")},
        ),
        (
            "Ruxsatlar",
            {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")},
        ),
        ("Sanalar", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("phone", "first_name", "last_name", "password1", "password2"),
            },
        ),
    )
