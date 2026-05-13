"""Root URL configuration — all API endpoints under /api/v1/."""

from django.contrib import admin
from django.urls import include, path

from apps.core.views import DashboardView, StudentCabinetView, TeacherCabinetView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/dashboard/", DashboardView.as_view(), name="dashboard"),
    path("api/v1/cabinets/student/", StudentCabinetView.as_view(), name="student-cabinet"),
    path("api/v1/cabinets/teacher/", TeacherCabinetView.as_view(), name="teacher-cabinet"),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/core/", include("apps.core.urls")),
    path("api/v1/students/", include("apps.students.urls")),
    path("api/v1/finance/", include("apps.finance.urls")),
    path("api/v1/education/", include("apps.education.urls")),
    path("api/v1/hr/", include("apps.hr.urls")),
    path("api/v1/crm/", include("apps.crm.urls")),
    path("api/v1/operations/", include("apps.operations.urls")),
    path("api/v1/system/", include("apps.system.urls")),
    path("api/v1/infrastructure/", include("apps.infrastructure.urls")),
    path("api/v1/science/", include("apps.science.urls")),
    path("api/v1/warehouse/", include("apps.warehouse.urls")),
    path("api/v1/legacy/", include("apps.legacy.urls")),
    path("api/v1/admin/", include("apps.admin_panel.urls")),
    path("api/v1/teachers/", include("apps.education.teacher_urls")),
]
