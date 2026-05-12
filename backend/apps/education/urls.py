from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AlumniViewSet,
    AttendanceViewSet,
    BookLoanViewSet,
    BookViewSet,
    BulkAttendanceView,
    BulkGradeView,
    CurriculumViewSet,
    ExamViewSet,
    GradeViewSet,
    InternshipViewSet,
    ScheduleViewSet,
    SubjectViewSet,
)

router = DefaultRouter()
router.register("subjects", SubjectViewSet, basename="subject")
router.register("schedule", ScheduleViewSet, basename="schedule")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("grades", GradeViewSet, basename="grade")
router.register("exams", ExamViewSet, basename="exam")
router.register("curriculums", CurriculumViewSet, basename="curriculum")
router.register("library/books", BookViewSet, basename="book")
router.register("library/loans", BookLoanViewSet, basename="bookloan")
router.register("alumni", AlumniViewSet, basename="alumni")
router.register("internships", InternshipViewSet, basename="internship")

urlpatterns = [
    path("attendance/bulk/", BulkAttendanceView.as_view(), name="attendance-bulk"),
    path("grades/bulk/", BulkGradeView.as_view(), name="grade-bulk"),
] + router.urls
