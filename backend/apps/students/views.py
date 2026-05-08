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
