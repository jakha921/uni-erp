"""Student API tests."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.models import Branch, Department, Faculty, Group, Specialty
from apps.students.models import Student


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(db):
    client = APIClient()
    user = User.objects.create_user(
        phone="+998900000001", password="pass", first_name="Test", last_name="User"
    )
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def group(db):
    branch = Branch.objects.create(name="BITU", code="bitu-test")
    faculty = Faculty.objects.create(name="AT", code="AT-T", branch=branch)
    dept = Department.objects.create(name="DI", code="DI-T", faculty=faculty)
    spec = Specialty.objects.create(name="DS", code="DS-T", level="bakalavr", department=dept)
    return Group.objects.create(
        name="DS-21-1", specialty=spec, course=1, education_form="kunduzgi", max_students=25
    )


@pytest.fixture
def student(db, group):
    user = User.objects.create_user(
        phone="+998900000002",
        password="pass",
        first_name="Ali",
        last_name="Karimov",
    )
    return Student.objects.create(
        user=user,
        student_id_number="ST-2021-0001",
        group=group,
        course=1,
        education_type="kontrakt",
        payment_form="kontrakt",
        enrollment_date="2021-09-01",
        status="active",
    )


@pytest.mark.django_db
def test_list_students(auth_client, student):
    url = reverse("student-list")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_filter_by_faculty(auth_client, student, group):
    faculty_id = group.specialty.department.faculty.id
    url = reverse("student-list")
    resp = auth_client.get(url, {"faculty_id": faculty_id})
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_search_by_name(auth_client, student):
    url = reverse("student-list")
    resp = auth_client.get(url, {"search": "Karimov"})
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_student_detail(auth_client, student):
    url = reverse("student-detail", args=[student.id])
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert data["studentIdNumber"] == "ST-2021-0001"
    assert data["fullName"] == "Karimov Ali"


@pytest.mark.django_db
def test_pagination(auth_client, group):
    for i in range(25):
        u = User.objects.create_user(
            phone=f"+99895555{i:04d}", password="p", first_name="A", last_name="B"
        )
        Student.objects.create(
            user=u,
            student_id_number=f"ST-BULK-{i:04d}",
            group=group,
            course=1,
            education_type="kontrakt",
            payment_form="kontrakt",
            enrollment_date="2021-09-01",
        )
    url = reverse("student-list")
    resp = auth_client.get(url, {"page": 1})
    assert resp.status_code == 200
    data = resp.json()
    assert data["count"] >= 25
    assert len(data["results"]) <= 20  # default page size


@pytest.mark.django_db
def test_statistics_endpoint(auth_client, student):
    url = reverse("student-statistics")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "totalStudents" in data
    assert "byFaculty" in data
    assert "byCourse" in data
