from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    StatisticsView,
    StudentAttendanceView,
    StudentDocumentViewSet,
    StudentGradesView,
    StudentViewSet,
)

router = DefaultRouter()
router.register("", StudentViewSet, basename="student")

doc_router = DefaultRouter()
doc_router.register("", StudentDocumentViewSet, basename="student-document")

urlpatterns = [
    path("statistics/", StatisticsView.as_view(), name="student-statistics"),
    path("<int:pk>/grades/", StudentGradesView.as_view(), name="student-grades"),
    path("<int:pk>/attendance/", StudentAttendanceView.as_view(), name="student-attendance"),
    path(
        "<int:student_pk>/documents/",
        StudentDocumentViewSet.as_view({"get": "list", "post": "create"}),
        name="student-documents",
    ),
    path(
        "<int:student_pk>/documents/<int:pk>/",
        StudentDocumentViewSet.as_view({"get": "retrieve", "delete": "destroy"}),
        name="student-document-detail",
    ),
] + router.urls
