"""Finance API tests."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.models import Branch, Department, Faculty, Group, Specialty
from apps.finance.models import Contract
from apps.students.models import Student


@pytest.fixture
def auth_client(db):
    client = APIClient()
    user = User.objects.create_user(
        phone="+998900000010", password="pass", first_name="T", last_name="U"
    )
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def student(db):
    branch = Branch.objects.create(name="NIU", code="niu-fin")
    faculty = Faculty.objects.create(name="AT", code="AT-F", branch=branch)
    dept = Department.objects.create(name="DI", code="DI-F", faculty=faculty)
    spec = Specialty.objects.create(name="DS", code="DS-F", level="bakalavr", department=dept)
    group = Group.objects.create(
        name="DS-21-1", specialty=spec, course=1, education_form="kunduzgi", max_students=25
    )
    user = User.objects.create_user(
        phone="+998900000020", password="pass", first_name="Ali", last_name="Karimov"
    )
    return Student.objects.create(
        user=user,
        student_id_number="ST-FIN-001",
        group=group,
        course=1,
        education_type="kontrakt",
        payment_form="kontrakt",
        enrollment_date="2021-09-01",
    )


@pytest.fixture
def contract(student):
    return Contract.objects.create(
        contract_number="CNT-2025-0001",
        student=student,
        contract_type="bazoviy",
        contract_amount=9_000_000,
        debt_amount=9_000_000,
        contract_date="2025-09-01",
        due_date="2026-06-30",
    )


@pytest.mark.django_db
def test_list_contracts(auth_client, contract):
    url = reverse("contract-list")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_contract_detail(auth_client, contract):
    url = reverse("contract-detail", args=[contract.id])
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert data["contractNumber"] == "CNT-2025-0001"
    assert float(data["contractAmount"]) == 9_000_000


@pytest.mark.django_db
def test_create_payment_recalculates_debt(auth_client, contract):
    url = reverse("payment-list")
    resp = auth_client.post(
        url,
        {
            "contractId": contract.id,
            "amount": "4500000.00",
            "paymentDate": "2025-10-01T10:00:00Z",
            "paymentMethod": "bank",
            "receiptNumber": "REC-001",
        },
        format="json",
    )
    assert resp.status_code == 201
    contract.refresh_from_db()
    assert float(contract.paid_amount) == 4_500_000
    assert float(contract.debt_amount) == 4_500_000
    assert contract.status == "active"


@pytest.mark.django_db
def test_filter_contracts(auth_client, contract):
    url = reverse("contract-list")
    resp = auth_client.get(url, {"status": "active"})
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_dashboard_stats(auth_client, contract):
    url = reverse("finance-dashboard")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert "totalContracts" in data
    assert data["totalContracts"] >= 1
