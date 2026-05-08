"""HR admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Employee, HrOrder, Leave


@admin.register(Employee)
class EmployeeAdmin(ModelAdmin):
    list_display = [
        "employee_id_number",
        "user",
        "department",
        "position",
        "employment_form",
        "status",
        "hire_date",
    ]
    list_filter = ["status", "employment_form", "academic_degree", "academic_rank", "is_deleted"]
    search_fields = [
        "employee_id_number",
        "user__first_name",
        "user__last_name",
        "position",
    ]
    raw_id_fields = ["user", "department"]


@admin.register(HrOrder)
class HrOrderAdmin(ModelAdmin):
    list_display = ["number", "type", "title", "employee", "date", "status"]
    list_filter = ["type", "status"]
    search_fields = ["number", "title", "employee__user__last_name"]
    raw_id_fields = ["employee"]


@admin.register(Leave)
class LeaveAdmin(ModelAdmin):
    list_display = ["employee", "type", "start_date", "end_date", "days", "status"]
    list_filter = ["type", "status"]
    search_fields = ["employee__user__last_name", "employee__employee_id_number"]
    raw_id_fields = ["employee"]
