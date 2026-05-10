"""Education API tests."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.models import (
    AcademicYear,
    Branch,
    Department,
    Faculty,
    Group,
    Semester,
    Specialty,
)
from apps.education.models import Attendance, Grade, Schedule, Subject
from apps.students.models import Student


@pytest.fixture
def auth_client(db):
    client = APIClient()
    user = User.objects.create_user(
        phone="+998900000030", password="p", first_name="T", last_name="U"
    )
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def teacher(db):
    return User.objects.create_user(
        phone="+998900000031", password="p", first_name="Teacher", last_name="One"
    )


@pytest.fixture
def setup_data(db, teacher):
    branch = Branch.objects.create(name="NIU", code="niu-edu")
    faculty = Faculty.objects.create(name="AT", code="AT-E", branch=branch)
    dept = Department.objects.create(name="DI", code="DI-E", faculty=faculty)
    spec = Specialty.objects.create(name="DS", code="DS-E", level="bakalavr", department=dept)
    group = Group.objects.create(
        name="DS-21-2", specialty=spec, course=1, education_form="kunduzgi", max_students=25
    )
    year = AcademicYear.objects.create(
        name="2025-2026",
        branch=branch,
        start_date="2025-09-01",
        end_date="2026-06-30",
        is_current=True,
    )
    semester = Semester.objects.create(
        academic_year=year, number=1, start_date="2025-09-01", end_date="2026-01-31"
    )
    subject = Subject.objects.create(name="Matematika", code="MAT-E", credits=4, department=dept)
    schedule = Schedule.objects.create(
        group=group,
        subject=subject,
        teacher=teacher,
        semester=semester,
        day_of_week=1,
        pair_number=1,
        room="101-A",
        lesson_type="lecture",
    )
    user = User.objects.create_user(
        phone="+998900000032", password="p", first_name="Ali", last_name="K"
    )
    student = Student.objects.create(
        user=user,
        student_id_number="ST-EDU-001",
        group=group,
        course=1,
        education_type="kontrakt",
        payment_form="kontrakt",
        enrollment_date="2021-09-01",
    )
    return {
        "group": group,
        "semester": semester,
        "subject": subject,
        "schedule": schedule,
        "student": student,
        "teacher": teacher,
    }


@pytest.mark.django_db
def test_list_subjects(auth_client, setup_data):
    url = reverse("subject-list")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_bulk_attendance(auth_client, setup_data):
    url = reverse("attendance-bulk")
    resp = auth_client.post(
        url,
        {
            "scheduleId": setup_data["schedule"].id,
            "date": "2025-09-08",
            "records": [{"studentId": setup_data["student"].id, "status": "present"}],
        },
        format="json",
    )
    assert resp.status_code == 201
    assert Attendance.objects.filter(student=setup_data["student"], date="2025-09-08").exists()


@pytest.mark.django_db
def test_bulk_grades(auth_client, setup_data):
    url = reverse("grade-bulk")
    resp = auth_client.post(
        url,
        {
            "subjectId": setup_data["subject"].id,
            "semesterId": setup_data["semester"].id,
            "gradeType": "midterm",
            "maxScore": "100.00",
            "records": [{"studentId": setup_data["student"].id, "score": "85.00"}],
        },
        format="json",
    )
    assert resp.status_code == 201
    assert Grade.objects.filter(student=setup_data["student"], grade_type="midterm").exists()


@pytest.mark.django_db
def test_filter_schedule_by_group(auth_client, setup_data):
    url = reverse("schedule-list")
    resp = auth_client.get(url, {"group": setup_data["group"].id})
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1
