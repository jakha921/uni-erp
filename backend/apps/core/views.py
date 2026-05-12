"""Core read-only ViewSets for reference data + AuditLogListView + Dashboard."""

import django_filters
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView  # noqa: F401
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


class DashboardView(APIView):
    """Aggregated dashboard stats for all roles."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        from django.db.models import Avg, Count, Sum
        from django.utils import timezone

        from apps.education.models import Grade
        from apps.finance.models import Contract, Payment
        from apps.hr.models import Employee
        from apps.students.models import Student

        students_qs = Student.objects.filter(is_deleted=False)
        total_students = students_qs.count()
        active_students = students_qs.filter(status="active").count()
        new_students = students_qs.filter(created_at__year=timezone.now().year).count()
        graduated_students = students_qs.filter(status="graduated").count()
        total_employees = Employee.objects.filter(is_deleted=False).count()

        contracts_qs = Contract.objects.filter(is_deleted=False)
        total_contracts = contracts_qs.count()
        total_revenue = Payment.objects.aggregate(s=Sum("amount"))["s"] or 0
        total_debt = contracts_qs.aggregate(s=Sum("debt_amount"))["s"] or 0
        total_amount = contracts_qs.aggregate(s=Sum("contract_amount"))["s"] or 1
        collection_rate = (
            round(float(total_revenue) / float(total_amount) * 100, 1) if total_amount else 0
        )

        faculties = Faculty.objects.count()
        departments = Department.objects.count()
        groups = Group.objects.count()

        avg_grade = Grade.objects.aggregate(a=Avg("grade"))["a"]

        by_faculty = list(
            students_qs.values("group__specialty__department__faculty__name")
            .annotate(count=Count("id"))
            .order_by("-count")[:6]
        )

        return Response(
            {
                "totalStudents": total_students,
                "activeStudents": active_students,
                "newStudents": new_students,
                "graduatedStudents": graduated_students,
                "totalEmployees": total_employees,
                "totalContracts": total_contracts,
                "totalRevenue": str(total_revenue),
                "totalDebt": str(total_debt),
                "collectionRate": collection_rate,
                "avgGrade": round(float(avg_grade), 2) if avg_grade else None,
                "faculties": faculties,
                "departments": departments,
                "groups": groups,
                "byFaculty": [
                    {
                        "faculty": r["group__specialty__department__faculty__name"],
                        "count": r["count"],
                    }
                    for r in by_faculty
                ],
                "recentActivity": [],
            }
        )


class SendSmsView(APIView):
    """Send SMS notification to a phone number."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        phone = request.data.get("phone")
        message = request.data.get("message")
        if not phone or not message:
            return Response(
                {"detail": "phone and message required"},
                status=400,
            )
        from apps.core.sms import send_sms

        success = send_sms(phone, message)
        return Response({"success": success})


class SendNotificationView(APIView):
    """Send in-app notification (optionally with SMS)."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        from apps.accounts.models import User
        from apps.core.notifications import notify_user

        user_id = request.data.get("user_id")
        title = request.data.get("title", "")
        message = request.data.get("message", "")
        send_sms_flag = request.data.get("send_sms", False)

        if not user_id or not title:
            return Response({"detail": "user_id and title required"}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=404)

        notification = notify_user(
            user=user,
            title=title,
            message=message,
            send_sms=send_sms_flag,
        )
        return Response({"id": notification.id, "status": "sent"}, status=201)


class StudentCabinetView(APIView):
    """Aggregated data for the student cabinet page."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        from datetime import date

        from apps.education.models import Attendance, Grade, Schedule
        from apps.operations.models import Notification
        from apps.students.models import Student

        try:
            student = Student.objects.select_related("user", "group").get(user=request.user)
        except Student.DoesNotExist:
            return Response({"detail": "Student profile not found."}, status=404)

        today = date.today()
        today_schedules = list(
            Schedule.objects.filter(group=student.group, day_of_week=today.isoweekday())
            .select_related("subject", "teacher")
            .values(
                "subject__name", "teacher__first_name", "teacher__last_name", "pair_number", "room"
            )
        )
        current_grades = list(
            Grade.objects.filter(student=student)
            .select_related("subject")
            .values("subject__name", "grade_type", "score", "max_score")
            .order_by("-updated_at")[:20]
        )
        notifications = list(
            Notification.objects.filter(user=request.user, is_read=False)
            .values("id", "title", "message", "created_at")
            .order_by("-created_at")[:10]
        )
        attendance_count = Attendance.objects.filter(student=student).count()
        present_count = Attendance.objects.filter(student=student, status="present").count()

        return Response(
            {
                "student": {
                    "id": student.id,
                    "fullName": student.user.full_name,
                    "studentIdNumber": student.student_id_number,
                    "group": student.group.name if student.group else "",
                    "level": student.level,
                },
                "todaySchedule": today_schedules,
                "currentGrades": current_grades,
                "notifications": notifications,
                "attendanceRate": round(present_count / attendance_count * 100, 1)
                if attendance_count
                else 0,
            }
        )


class TeacherCabinetView(APIView):
    """Aggregated data for the teacher cabinet page."""

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        from datetime import date

        from apps.education.models import Schedule
        from apps.hr.models import Employee
        from apps.operations.models import Notification, Task

        try:
            employee = Employee.objects.select_related("user", "department").get(user=request.user)
        except Employee.DoesNotExist:
            return Response({"detail": "Employee profile not found."}, status=404)

        today = date.today()
        today_classes = list(
            Schedule.objects.filter(teacher=request.user, day_of_week=today.isoweekday())
            .select_related("subject", "group")
            .values("subject__name", "group__name", "pair_number", "room", "lesson_type")
        )
        my_groups = list(
            Schedule.objects.filter(teacher=request.user)
            .values_list("group__name", flat=True)
            .distinct()
        )
        pending_tasks = list(
            Task.objects.filter(assigned_to=request.user, status__in=["todo", "in_progress"])
            .values("id", "title", "priority", "due_date")
            .order_by("due_date")[:5]
        )
        notifications = list(
            Notification.objects.filter(user=request.user, is_read=False)
            .values("id", "title", "message", "created_at")
            .order_by("-created_at")[:10]
        )

        return Response(
            {
                "teacher": {
                    "id": employee.id,
                    "fullName": request.user.full_name,
                    "employeeIdNumber": employee.employee_id_number,
                    "department": employee.department.name if employee.department else "",
                    "position": employee.position,
                },
                "todayClasses": today_classes,
                "myGroups": my_groups,
                "pendingTasks": pending_tasks,
                "notifications": notifications,
            }
        )
