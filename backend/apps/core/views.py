"""Core read-only ViewSets for reference data."""

from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .filters import DepartmentFilter, GroupFilter
from .models import AcademicYear, Branch, Department, Faculty, Group, Semester, Specialty
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
