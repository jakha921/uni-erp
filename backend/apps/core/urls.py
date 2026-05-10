from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import (
    AcademicYearViewSet,
    AuditLogListView,
    BranchViewSet,
    DepartmentViewSet,
    FacultyViewSet,
    GroupViewSet,
    SemesterViewSet,
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


urlpatterns = router.urls + [
    path("audit/", AuditLogListView.as_view(), name="audit-log"),
]
