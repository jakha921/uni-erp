"""Operations URL configuration."""

from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AppealViewSet,
    ChatThreadViewSet,
    GenerateReportView,
    NewsViewSet,
    NotificationViewSet,
    ReportTemplateViewSet,
    TaskViewSet,
)

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("appeals", AppealViewSet, basename="appeal")
router.register("news", NewsViewSet, basename="news")
router.register("messages/threads", ChatThreadViewSet, basename="chatthread")
router.register("reports/templates", ReportTemplateViewSet, basename="reporttemplate")

urlpatterns = router.urls + [
    path("reports/generate/", GenerateReportView.as_view(), name="generate-report"),
]
