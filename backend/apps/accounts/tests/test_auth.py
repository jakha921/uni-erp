"""Auth API tests — login, me, logout."""

import pytest
from django.urls import reverse
from rest_framework.test import APIClient

from apps.accounts.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    u = User.objects.create_user(
        phone="+998901234567",
        password="testpass123",
        first_name="Ali",
        last_name="Karimov",
    )
    return u


@pytest.mark.django_db
def test_login_success(api_client, user):
    url = reverse("auth-login")
    resp = api_client.post(url, {"phone": "+998901234567", "password": "testpass123"})
    assert resp.status_code == 200
    data = resp.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["phone"] == "+998901234567"
    assert data["user"]["name"] == "Karimov Ali"


@pytest.mark.django_db
def test_login_wrong_password(api_client, user):
    url = reverse("auth-login")
    resp = api_client.post(url, {"phone": "+998901234567", "password": "wrongpass"})
    assert resp.status_code == 400


@pytest.mark.django_db
def test_me_authenticated(api_client, user):
    api_client.force_authenticate(user=user)
    url = reverse("auth-me")
    resp = api_client.get(url)
    assert resp.status_code == 200
    assert resp.json()["phone"] == "+998901234567"


@pytest.mark.django_db
def test_me_unauthenticated(api_client):
    url = reverse("auth-me")
    resp = api_client.get(url)
    assert resp.status_code == 401
