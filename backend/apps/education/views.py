"""Education views — Subject, Schedule, Attendance, Grade, Exam, Curriculum."""

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet, ReadOnlyModelViewSet

from .filters import CurriculumFilter, ExamFilter
from .models import Attendance, Curriculum, Exam, Grade, Schedule, Subject
from .serializers import (
    AttendanceSerializer,
    BulkAttendanceSerializer,
    BulkGradeSerializer,
    CurriculumCreateSerializer,
    CurriculumSerializer,
    ExamCreateSerializer,
    ExamSerializer,
    GradeSerializer,
    ScheduleSerializer,
    SubjectSerializer,
)


class SubjectViewSet(ReadOnlyModelViewSet):
    queryset = Subject.objects.select_related("department").all()
    serializer_class = SubjectSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["department"]
    search_fields = ["name", "code"]


class ScheduleViewSet(ModelViewSet):
    serializer_class = ScheduleSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["group", "teacher", "semester", "day_of_week"]

    def get_queryset(self):
        return Schedule.objects.select_related("group", "subject", "teacher", "semester").all()


class AttendanceViewSet(ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["schedule", "date", "student"]

    def get_queryset(self):
        return Attendance.objects.select_related("student__user", "schedule__subject").all()


class BulkAttendanceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = BulkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        records = serializer.save()
        return Response({"created": len(records)}, status=status.HTTP_201_CREATED)


class GradeViewSet(ModelViewSet):
    serializer_class = GradeSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["student", "subject", "semester", "grade_type"]

    def get_queryset(self):
        return Grade.objects.select_related(
            "student__user", "subject", "semester", "graded_by"
        ).all()


class BulkGradeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = BulkGradeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        records = serializer.save()
        return Response({"created": len(records)}, status=status.HTTP_201_CREATED)


class ExamViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = ExamFilter
    search_fields = ["subject__name", "group__name", "room"]

    def get_queryset(self):
        return Exam.objects.select_related("subject", "group", "teacher", "semester").all()

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ExamCreateSerializer
        return ExamSerializer


class CurriculumViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = CurriculumFilter
    search_fields = ["specialty__name", "description"]

    def get_queryset(self):
        return (
            Curriculum.objects.select_related("specialty")
            .prefetch_related("subjects__subject")
            .all()
        )

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return CurriculumCreateSerializer
        return CurriculumSerializer
