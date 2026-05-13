"""Core admin — reference data via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import (
    AcademicYear,
    Branch,
    Department,
    Faculty,
    Group,
    ReferenceData,
    Semester,
    Specialty,
)


@admin.register(Branch)
class BranchAdmin(ModelAdmin):
    list_display = ["name", "code", "is_active"]
    search_fields = ["name", "code"]


@admin.register(Faculty)
class FacultyAdmin(ModelAdmin):
    list_display = ["name", "code", "branch"]
    list_filter = ["branch"]
    search_fields = ["name", "code"]


@admin.register(Department)
class DepartmentAdmin(ModelAdmin):
    list_display = ["name", "code", "faculty"]
    list_filter = ["faculty"]
    search_fields = ["name", "code"]


@admin.register(Specialty)
class SpecialtyAdmin(ModelAdmin):
    list_display = ["name", "code", "level", "department"]
    list_filter = ["level", "department__faculty"]
    search_fields = ["name", "code"]


@admin.register(AcademicYear)
class AcademicYearAdmin(ModelAdmin):
    list_display = ["name", "branch", "is_current", "start_date", "end_date"]
    list_filter = ["branch", "is_current"]


@admin.register(Semester)
class SemesterAdmin(ModelAdmin):
    list_display = ["academic_year", "number", "start_date", "end_date"]
    list_filter = ["academic_year"]


@admin.register(Group)
class GroupAdmin(ModelAdmin):
    list_display = ["name", "course", "education_form", "specialty"]
    list_filter = ["course", "education_form", "specialty__department__faculty"]
    search_fields = ["name"]


@admin.register(ReferenceData)
class ReferenceDataAdmin(ModelAdmin):
    list_display = ["type", "code", "name", "hemis_id", "is_active", "sort_order"]
    list_filter = ["type", "is_active"]
    search_fields = ["name", "name_uz", "name_ru", "code"]
    ordering = ["type", "sort_order", "name"]
