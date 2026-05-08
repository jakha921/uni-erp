"""Core read-only ViewSets for reference data + AuditLogListView."""

import django_filters
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .filters import DepartmentFilter, GroupFilter
from .models import AcademicYear, AuditLog, Branch, Department, Faculty, Group, Semester, Specialty
from .serializers import (
    AcademicYearSerializer,
    BranchSerializer,
    DepartmentSerializer,
    FacultySerializer,
    GroupSerializer,
    SemesterSerializer,
    SpecialtySerializer,
)


class BranchViewSet(ReadOnlyModelViewSet):
    queryset = Branch.objects.filter(is_active=True)
    serializer_class = BranchSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "code"]


class FacultyViewSet(ReadOnlyModelViewSet):
    queryset = Faculty.objects.select_related("branch").all()
    serializer_class = FacultySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["branch"]
    search_fields = ["name", "code"]


class DepartmentViewSet(ReadOnlyModelViewSet):
    queryset = Department.objects.select_related("faculty").all()
    serializer_class = DepartmentSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = DepartmentFilter
    search_fields = ["name", "code"]


class SpecialtyViewSet(ReadOnlyModelViewSet):
    queryset = Specialty.objects.select_related("department").all()
    serializer_class = SpecialtySerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["department", "level"]
    search_fields = ["name", "code"]


class AcademicYearViewSet(ReadOnlyModelViewSet):
    queryset = AcademicYear.objects.prefetch_related("semesters").order_by("-start_date")
    serializer_class = AcademicYearSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["branch", "is_current"]


class SemesterViewSet(ReadOnlyModelViewSet):
    queryset = Semester.objects.select_related("academic_year").all()
    serializer_class = SemesterSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["academic_year"]


class GroupViewSet(ReadOnlyModelViewSet):
    queryset = Group.objects.select_related("specialty__department__faculty").all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]
    filterset_class = GroupFilter
    search_fields = ["name"]


class AuditLogFilter(django_filters.FilterSet):
    user_id = django_filters.NumberFilter(field_name="user__id")
    model = django_filters.CharFilter(lookup_expr="icontains")
    action = django_filters.ChoiceFilter(choices=AuditLog.ACTION_CHOICES)
    date_from = django_filters.DateFilter(field_name="timestamp", lookup_expr="date__gte")
    date_to = django_filters.DateFilter(field_name="timestamp", lookup_expr="date__lte")

    class Meta:
        model = AuditLog
        fields = ["user_id", "model", "action", "date_from", "date_to"]


class AuditLogListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    filterset_class = AuditLogFilter

    def get_queryset(self):
        return AuditLog.objects.select_related("user").order_by("-timestamp")

    def list(self, request, *args, **kwargs):
        from rest_framework.response import Response

        qs = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(qs)
        data = [
            {
                "id": a.id,
                "userId": a.user_id,
                "userName": a.user.full_name if a.user else "",
                "action": a.action,
                "model": a.model,
                "objectId": a.object_id,
                "path": a.path,
                "ipAddress": a.ip_address,
                "timestamp": a.timestamp.isoformat(),
            }
            for a in (page if page is not None else qs)
        ]
        if page is not None:
            return self.get_paginated_response(data)
        return Response(data)
