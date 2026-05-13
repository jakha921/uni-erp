"""HEMIS API client for syncing university data."""

import os
from typing import Any

import requests

HEMIS_BASE_URL = os.environ.get("HEMIS_BASE_URL", "https://student.hemis.uz/rest/v1")
HEMIS_TOKEN = os.environ.get("HEMIS_TOKEN", "")


class HemisError(Exception):
    pass


class HemisClient:
    def __init__(self, base_url: str = HEMIS_BASE_URL, token: str = HEMIS_TOKEN) -> None:
        self.base_url = base_url.rstrip("/")
        self.token = token

    def _get(self, endpoint: str, params: dict | None = None) -> dict:
        if not self.token:
            raise HemisError("HEMIS_TOKEN is not configured")
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {"Authorization": f"Bearer {self.token}"}
        try:
            response = requests.get(url, headers=headers, params=params or {}, timeout=30)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            raise HemisError(f"HEMIS API request failed: {e}") from e

    def _get_list(self, endpoint: str, params: dict | None = None) -> list:
        data = self._get(endpoint, params)
        if isinstance(data, dict):
            return data.get("data", data.get("items", []))
        return data if isinstance(data, list) else []

    def get_departments(self) -> list[dict[str, Any]]:
        return self._get_list("/data/department-list")

    def get_specialties(self) -> list[dict[str, Any]]:
        return self._get_list("/data/specialty-list")

    def get_groups(self) -> list[dict[str, Any]]:
        return self._get_list("/data/group-list")

    def get_students(self, page: int = 1) -> dict[str, Any]:
        return self._get("/data/student-list", params={"page": page})

    def get_subjects(self) -> list[dict[str, Any]]:
        return self._get_list("/data/subject-list")

    def get_semesters(self) -> list[dict[str, Any]]:
        return self._get_list("/data/semester-list")

    def get_curriculum(self) -> list[dict[str, Any]]:
        return self._get_list("/data/curriculum-list")

    def get_employees(self) -> list[dict[str, Any]]:
        return self._get_list("/data/employee-list")

    def get_student_grades(self, student_id: int) -> list[dict[str, Any]]:
        return self._get_list(f"/data/student-grades/{student_id}")

    def get_schedule(self, params: dict | None = None) -> list[dict[str, Any]]:
        return self._get_list("/data/schedule-list", params=params)
