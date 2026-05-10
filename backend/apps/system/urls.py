from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import AuditLogListView, RoleListView, SystemUserViewSet

router = DefaultRouter()
router.register("users", SystemUserViewSet, basename="system-user")

urlpatterns = router.urls + [
    path("roles/", RoleListView.as_view(), name="system-roles"),
    path("audit-log/", AuditLogListView.as_view(), name="system-audit-log"),
]
