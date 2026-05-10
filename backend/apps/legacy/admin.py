from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import LegacyOrder, StaffingPosition


@admin.register(LegacyOrder)
class LegacyOrderAdmin(ModelAdmin):
    list_display = ["number", "type", "employee_name", "department", "date", "status"]
    list_filter = ["type", "status"]


@admin.register(StaffingPosition)
class StaffingPositionAdmin(ModelAdmin):
    list_display = [
        "department_name",
        "position_name",
        "total_slots",
        "filled_slots",
        "salary",
    ]
