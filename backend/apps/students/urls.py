from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import StatisticsView, StudentAttendanceView, StudentGradesView, StudentViewSet

router = DefaultRouter()
router.register("", StudentViewSet, basename="student")

urlpatterns = [
    path("statistics/", StatisticsView.as_view(), name="student-statistics"),
    path("<int:pk>/grades/", StudentGradesView.as_view(), name="student-grades"),
    path("<int:pk>/attendance/", StudentAttendanceView.as_view(), name="student-attendance"),
] + router.urls
