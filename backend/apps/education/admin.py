"""Education admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin

from .models import (
    Alumni,
    Attendance,
    Book,
    BookLoan,
    Curriculum,
    CurriculumSubject,
    Exam,
    Grade,
    Internship,
    Schedule,
    Subject,
)


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


@admin.register(Exam)
class ExamAdmin(ModelAdmin):
    list_display = [
        "subject",
        "group",
        "teacher",
        "exam_type",
        "date",
        "start_time",
        "room",
        "status",
    ]
    list_filter = ["exam_type", "status", "semester"]
    search_fields = ["subject__name", "group__name", "teacher__last_name", "room"]


class CurriculumSubjectInline(admin.TabularInline):
    model = CurriculumSubject
    extra = 0
    fields = ["subject", "semester_number", "hours_total", "is_elective"]


@admin.register(Curriculum)
class CurriculumAdmin(ModelAdmin):
    list_display = ["specialty", "year", "total_credits"]
    list_filter = ["specialty", "year"]
    search_fields = ["specialty__name"]
    inlines = [CurriculumSubjectInline]


@admin.register(Book)
class BookAdmin(ModelAdmin):
    list_display = [
        "title",
        "author",
        "isbn",
        "year",
        "category",
        "copies_total",
        "copies_available",
    ]
    list_filter = ["category", "year"]
    search_fields = ["title", "author", "isbn"]


@admin.register(BookLoan)
class BookLoanAdmin(ModelAdmin):
    list_display = ["book", "student", "issued_date", "due_date", "returned_date", "status"]
    list_filter = ["status"]
    search_fields = ["book__title", "student__user__last_name"]


@admin.register(Alumni)
class AlumniAdmin(ModelAdmin):
    list_display = ["full_name", "graduation_year", "faculty", "specialty", "workplace", "status"]
    list_filter = ["graduation_year", "faculty", "status"]
    search_fields = ["full_name", "workplace", "email"]


@admin.register(Internship)
class InternshipAdmin(ModelAdmin):
    list_display = ["student", "company", "start_date", "end_date", "internship_type", "status"]
    list_filter = ["internship_type", "status"]
    search_fields = ["company", "supervisor", "student__user__last_name"]
