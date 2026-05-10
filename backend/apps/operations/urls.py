"""Operations URL configuration."""

from rest_framework.routers import DefaultRouter

from .views import AppealViewSet, NewsViewSet, NotificationViewSet, TaskViewSet

router = DefaultRouter()
router.register("tasks", TaskViewSet, basename="task")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("appeals", AppealViewSet, basename="appeal")
router.register("news", NewsViewSet, basename="news")

urlpatterns = router.urls
