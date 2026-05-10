"""HR API tests."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.models import Branch, Department, Faculty
from apps.hr.models import Employee, HrOrder, Leave


@pytest.fixture
def auth_client(db):
    client = APIClient()
    user = User.objects.create_user(
        phone="+998900000040", password="p", first_name="T", last_name="U"
    )
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def setup_data(db):
    branch = Branch.objects.create(name="NIU", code="niu-hr")
    faculty = Faculty.objects.create(name="IT", code="IT-HR", branch=branch)
    dept = Department.objects.create(name="CS", code="CS-HR", faculty=faculty)
    user = User.objects.create_user(
        phone="+998900000041", password="p", first_name="Ali", last_name="Karimov"
    )
    employee = Employee.objects.create(
        user=user,
        employee_id_number="EMP-TEST-001",
        department=dept,
        position="Dotsent",
        position_code="dotsent",
        employment_form="asosiy",
        hire_date="2020-09-01",
        gender="male",
        salary=5_000_000,
    )
    return {"dept": dept, "employee": employee, "faculty": faculty}


@pytest.mark.django_db
def test_list_employees(auth_client, setup_data):
    url = reverse("employee-list")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_filter_employees_by_department(auth_client, setup_data):
    url = reverse("employee-list")
    resp = auth_client.get(url, {"department_id": setup_data["dept"].id})
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_get_employee_detail(auth_client, setup_data):
    url = reverse("employee-detail", args=[setup_data["employee"].id])
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert data["employeeIdNumber"] == "EMP-TEST-001"
    assert "experience" in data
    assert "salary" in data


@pytest.mark.django_db
def test_create_employee(auth_client, setup_data):
    url = reverse("employee-list")
    resp = auth_client.post(
        url,
        {
            "firstName": "Bobur",
            "secondName": "Toshmatov",
            "gender": "male",
            "birthDate": "1990-05-15",
            "departmentId": setup_data["dept"].id,
            "position": "Professor",
            "positionCode": "professor",
            "hireDate": "2022-09-01",
            "phone": "+998900000099",
            "salary": "8000000.00",
        },
        format="json",
    )
    assert resp.status_code == 201
    assert Employee.objects.filter(position="Professor").exists()


@pytest.mark.django_db
def test_soft_delete_employee(auth_client, setup_data):
    url = reverse("employee-detail", args=[setup_data["employee"].id])
    resp = auth_client.delete(url)
    assert resp.status_code == 204
    setup_data["employee"].refresh_from_db()
    assert setup_data["employee"].is_deleted is True


@pytest.mark.django_db
def test_hr_dashboard(auth_client, setup_data):
    url = reverse("hr-dashboard")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "totalEmployees" in data
    assert "byStatus" in data
    assert "byDepartment" in data


@pytest.mark.django_db
def test_create_order(auth_client, setup_data):
    url = reverse("hr-order-list")
    resp = auth_client.post(
        url,
        {
            "number": "HR-TEST-001",
            "type": "hire",
            "title": "Ishga qabul buyrug'i",
            "employee": setup_data["employee"].id,
            "date": "2024-01-15",
            "effective_date": "2024-01-16",
            "status": "draft",
        },
        format="json",
    )
    assert resp.status_code == 201
    assert HrOrder.objects.filter(number="HR-TEST-001").exists()


@pytest.mark.django_db
def test_create_leave(auth_client, setup_data):
    url = reverse("leave-list")
    resp = auth_client.post(
        url,
        {
            "employee": setup_data["employee"].id,
            "type": "annual",
            "start_date": "2025-07-01",
            "end_date": "2025-07-28",
            "days": 28,
            "status": "pending",
        },
        format="json",
    )
    assert resp.status_code == 201
    assert Leave.objects.filter(employee=setup_data["employee"], type="annual").exists()


@pytest.mark.django_db
def test_hr_attendance(auth_client, setup_data):
    url = reverse("hr-attendance")
    resp = auth_client.get(url, {"year": 2025, "month": 5})
    assert resp.status_code == 200
    rows = resp.json()
    assert isinstance(rows, list)
    assert len(rows) >= 1
    row = rows[0]
    assert "employeeId" in row
    assert "employeeName" in row
    assert "days" in row
    assert len(row["days"]) == 31  # May has 31 days
    assert all("date" in d and "status" in d for d in row["days"])


@pytest.mark.django_db
def test_hr_dashboard_full(auth_client, setup_data):
    url = reverse("hr-dashboard")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "activeEmployees" in data
    assert "pendingOrders" in data
    assert "pendingLeaves" in data
    assert "byAge" in data
    assert "scienceStats" in data
    assert "recentOrders" in data
