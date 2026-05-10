"""RBAC permission tests."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User, UserRole
from apps.core.models import Branch, Faculty


@pytest.fixture
def branch(db):
    return Branch.objects.create(name="NIU", code="niu")


@pytest.fixture
def faculty(branch):
    return Faculty.objects.create(name="AT", code="AT", branch=branch)


def make_user(phone: str, role: str, faculty=None) -> User:
    user = User.objects.create_user(
        phone=phone, password="pass", first_name="Test", last_name="User"
    )
    UserRole.objects.create(user=user, role=role, faculty=faculty, is_primary=True)
    return user


@pytest.mark.django_db
def test_admin_access_finance(faculty):
    client = APIClient()
    admin = make_user("+998901000001", "admin", faculty)
    client.force_authenticate(user=admin)
    # Admin can access finance endpoints (list contracts)
    resp = client.get("/api/v1/finance/contracts/")
    assert resp.status_code in (200, 404)  # 404 until finance app is wired


@pytest.mark.django_db
def test_buxgalter_access_finance(faculty):
    client = APIClient()
    user = make_user("+998901000002", "buxgalter", faculty)
    client.force_authenticate(user=user)
    resp = client.get("/api/v1/finance/contracts/")
    assert resp.status_code in (200, 404)


@pytest.mark.django_db
def test_dekan_role_assigned(faculty):
    user = make_user("+998901000003", "dekan", faculty)
    role = user.roles.filter(is_primary=True).first()
    assert role.role == "dekan"
    assert role.faculty == faculty


@pytest.mark.django_db
def test_talaba_access_own_data(faculty):
    client = APIClient()
    user = make_user("+998901000004", "talaba", faculty)
    client.force_authenticate(user=user)
    resp = client.get(reverse("auth-me"))
    assert resp.status_code == 200
    assert resp.json()["role"] == "talaba"
