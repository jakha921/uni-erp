"""Root URL configuration — all API endpoints under /api/v1/."""

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.accounts.urls")),
    path("api/v1/core/", include("apps.core.urls")),
    path("api/v1/students/", include("apps.students.urls")),
    path("api/v1/finance/", include("apps.finance.urls")),
    path("api/v1/education/", include("apps.education.urls")),
    path("api/v1/hr/", include("apps.hr.urls")),
]
