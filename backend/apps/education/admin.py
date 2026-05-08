"""Education admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import Attendance, Grade, Schedule, Subject


@admin.register(Subject)
class SubjectAdmin(ModelAdmin):
    list_display = ["code", "name", "credits", "department"]
    list_filter = ["department"]
    search_fields = ["name", "code"]


@admin.register(Schedule)
class ScheduleAdmin(ModelAdmin):
    list_display = ["group", "subject", "teacher", "day_of_week", "pair_number", "room"]
    list_filter = ["day_of_week", "lesson_type", "semester"]
    search_fields = ["group__name", "subject__name", "teacher__last_name"]


@admin.register(Attendance)
class AttendanceAdmin(ModelAdmin):
    list_display = ["student", "schedule", "date", "status"]
    list_filter = ["status", "date"]
    search_fields = ["student__user__last_name", "student__student_id_number"]


@admin.register(Grade)
class GradeAdmin(ModelAdmin):
    list_display = ["student", "subject", "semester", "grade_type", "score", "max_score"]
    list_filter = ["grade_type", "semester"]
    search_fields = ["student__user__last_name", "subject__name"]
