"""Student views — CRUD ViewSet + statistics endpoint."""

from django.db.models import Count
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet

from .filters import StudentFilter
from .models import Student
from .serializers import (
    CreateStudentSerializer,
    StudentDetailSerializer,
    StudentListSerializer,
    UpdateStudentSerializer,
)


class StudentViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    filterset_class = StudentFilter
    search_fields = [
        "user__first_name",
        "user__last_name",
        "user__middle_name",
        "student_id_number",
        "group__name",
    ]

    def get_queryset(self):
        return (
            Student.objects.filter(is_deleted=False)
            .select_related(
                "user",
                "group__specialty__department__faculty",
            )
            .prefetch_related("group__students")
        )

    def get_serializer_class(self):
        if self.action in ("list",):
            return StudentListSerializer
        if self.action == "create":
            return CreateStudentSerializer
        if self.action in ("partial_update", "update"):
            return UpdateStudentSerializer
        return StudentDetailSerializer

    def perform_destroy(self, instance: Student):
        instance.is_deleted = True
        instance.save(update_fields=["is_deleted"])

    def create(self, request: Request, *args, **kwargs) -> Response:
        serializer = CreateStudentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = serializer.save()
        return Response(
            StudentDetailSerializer(student, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class StatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        qs = Student.objects.filter(is_deleted=False)
        total = qs.count()
        by_faculty_data = list(
            qs.values("group__specialty__department__faculty__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        by_course = list(qs.values("course").annotate(count=Count("id")).order_by("course"))
        by_gender = list(qs.values("gender").annotate(count=Count("id")))
        by_education_form = list(qs.values("education_form").annotate(count=Count("id")))
        by_payment_form = list(qs.values("payment_form").annotate(count=Count("id")))
        by_status = list(qs.values("status").annotate(count=Count("id")))

        return Response(
            {
                "totalStudents": total,
                "byFaculty": [
                    {
                        "faculty": r["group__specialty__department__faculty__name"],
                        "count": r["count"],
                    }
                    for r in by_faculty_data
                ],
                "byCourse": [{"course": r["course"], "count": r["count"]} for r in by_course],
                "byGender": [{"gender": r["gender"], "count": r["count"]} for r in by_gender],
                "byEducationForm": [
                    {"form": r["education_form"], "count": r["count"]} for r in by_education_form
                ],
                "byPaymentForm": [
                    {"form": r["payment_form"], "count": r["count"]} for r in by_payment_form
                ],
                "byStatus": [{"status": r["status"], "count": r["count"]} for r in by_status],
            }
        )


class StudentGradesView(APIView):
    """GET /students/{id}/grades/ — returns grades from education.Grade model."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        try:
            from apps.education.models import Grade

            grades = Grade.objects.filter(student_id=pk).select_related(
                "subject", "semester", "graded_by"
            )
            data = [
                {
                    "id": g.id,
                    "subjectName": g.subject.name,
                    "subjectCode": g.subject.code,
                    "gradeType": g.grade_type,
                    "gradeTypeLabel": dict(g._meta.get_field("grade_type").choices).get(
                        g.grade_type, g.grade_type
                    ),
                    "score": float(g.score),
                    "maxScore": float(g.max_score),
                    "semester": g.semester.number,
                    "date": str(g.updated_at.date()),
                    "teacherName": g.graded_by.full_name,
                }
                for g in grades
            ]
        except Exception:
            data = []
        return Response(data)


class StudentAttendanceView(APIView):
    """GET /students/{id}/attendance/ — returns attendance from education.Attendance model."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: int) -> Response:
        try:
            from apps.education.models import Attendance

            records = Attendance.objects.filter(student_id=pk).select_related("schedule__subject")
            data = [
                {
                    "date": str(r.date),
                    "status": r.status,
                    "subjectName": r.schedule.subject.name,
                }
                for r in records
            ]
        except Exception:
            data = []
        return Response(data)
