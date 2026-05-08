"""Student admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Student


@admin.register(Student)
class StudentAdmin(ModelAdmin):
    list_display = [
        "student_id_number",
        "user",
        "group",
        "course",
        "status",
        "payment_form",
        "avg_grade",
    ]
    list_filter = ["status", "payment_form", "education_form", "course", "is_deleted"]
    search_fields = [
        "student_id_number",
        "user__first_name",
        "user__last_name",
        "group__name",
    ]
    raw_id_fields = ["user", "group"]
