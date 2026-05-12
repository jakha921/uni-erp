from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AttendanceViewSet,
    BulkAttendanceView,
    BulkGradeView,
    ExamViewSet,
    GradeViewSet,
    ScheduleViewSet,
    SubjectViewSet,
)

router = DefaultRouter()
router.register("subjects", SubjectViewSet, basename="subject")
router.register("schedule", ScheduleViewSet, basename="schedule")
router.register("attendance", AttendanceViewSet, basename="attendance")
router.register("grades", GradeViewSet, basename="grade")
router.register("exams", ExamViewSet, basename="exam")

urlpatterns = [
    path("attendance/bulk/", BulkAttendanceView.as_view(), name="attendance-bulk"),
    path("grades/bulk/", BulkGradeView.as_view(), name="grade-bulk"),
] + router.urls
