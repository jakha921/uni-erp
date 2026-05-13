from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    AuditLogListView,
    BranchViewSet,
    DepartmentViewSet,
    FacultyViewSet,
    GroupViewSet,
    HemisSyncView,
    ReferenceDataViewSet,
    SemesterViewSet,
    SendNotificationView,
    SendSmsView,
    SpecialtyViewSet,
)

router = DefaultRouter()
router.register("branches", BranchViewSet, basename="branch")
router.register("faculties", FacultyViewSet, basename="faculty")
router.register("departments", DepartmentViewSet, basename="department")
router.register("specialties", SpecialtyViewSet, basename="specialty")
router.register("academic-years", AcademicYearViewSet, basename="academic-year")
router.register("semesters", SemesterViewSet, basename="semester")
router.register("groups", GroupViewSet, basename="group")
router.register(r"references/(?P<ref_type>[^/.]+)", ReferenceDataViewSet, basename="references")

urlpatterns = router.urls + [
    path("audit/", AuditLogListView.as_view(), name="audit-log"),
    path("sms/send/", SendSmsView.as_view(), name="sms-send"),
    path("notifications/send/", SendNotificationView.as_view(), name="notification-send"),
    path("hemis/sync/", HemisSyncView.as_view(), name="hemis-sync"),
]
