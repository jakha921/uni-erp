"""Core API tests — faculties, departments with filters."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User
from apps.core.models import Branch, Department, Faculty


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def auth_client(db):
    client = APIClient()
    user = User.objects.create_user(
        phone="+998901111111", password="pass", first_name="Test", last_name="User"
    )
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def branch(db):
    return Branch.objects.create(name="NIU", code="niu")


@pytest.fixture
def faculty(branch):
    return Faculty.objects.create(name="Axborot texnologiyalari", code="AT", branch=branch)


@pytest.fixture
def department(faculty):
    return Department.objects.create(
        name="Dasturiy injiniring kafedrasi", code="DI", faculty=faculty
    )


@pytest.mark.django_db
def test_list_faculties(auth_client, faculty):
    url = reverse("faculty-list")
    resp = auth_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["count"] >= 1


@pytest.mark.django_db
def test_filter_departments_by_faculty(auth_client, faculty, department):
    url = reverse("department-list")
    resp = auth_client.get(url, {"faculty_id": faculty.id})
    assert resp.status_code == 200
    results = resp.json()["results"]
    assert len(results) >= 1
    assert all(d["faculty"] == faculty.id for d in results)


@pytest.mark.django_db
def test_unauthenticated_returns_401(api_client, branch):
    url = reverse("faculty-list")
    resp = api_client.get(url)
    assert resp.status_code == 401
