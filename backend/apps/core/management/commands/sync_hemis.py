"""Sync reference data and entities from HEMIS API."""

from django.core.management.base import BaseCommand

from apps.core.hemis import HemisClient, HemisError


class Command(BaseCommand):
    help = "Sync reference data from HEMIS API"

    def add_arguments(self, parser):
        parser.add_argument(
            "--type",
            choices=["references", "students", "employees", "all"],
            default="all",
            dest="sync_type",
        )
        parser.add_argument("--force", action="store_true", default=False)

    def handle(self, *args, **options):
        sync_type = options["sync_type"]
        try:
            client = HemisClient()
        except Exception as exc:
            self.stderr.write(self.style.ERROR(f"HEMIS client error: {exc}"))
            return

        if sync_type in ("references", "all"):
            self._sync_departments(client)
            self._sync_specialties(client)
            self._sync_groups(client)
            self._sync_semesters(client)
            self._sync_subjects(client)

        if sync_type in ("students", "all"):
            self._sync_students(client)

        if sync_type in ("employees", "all"):
            self._sync_employees(client)

        self.stdout.write(self.style.SUCCESS("HEMIS sync complete"))

    def _sync_departments(self, client: HemisClient) -> None:
        from apps.core.models import ReferenceData

        try:
            items = client.get_departments()
        except HemisError as exc:
            self.stderr.write(f"  departments: {exc}")
            return

        count = 0
        for item in items:
            hemis_id = item.get("id") or item.get("code")
            name = item.get("name") or item.get("name_uz", "")
            code = str(item.get("code", hemis_id or ""))
            if not code:
                continue
            ReferenceData.objects.update_or_create(
                type="custom",
                code=f"dept_{code}",
                defaults={"name": name, "hemis_id": hemis_id, "name_uz": name},
            )
            count += 1
        self.stdout.write(f"  Synced {count} departments")

    def _sync_specialties(self, client: HemisClient) -> None:
        from apps.core.models import ReferenceData

        try:
            items = client.get_specialties()
        except HemisError as exc:
            self.stderr.write(f"  specialties: {exc}")
            return

        count = 0
        for item in items:
            hemis_id = item.get("id") or item.get("code")
            name = item.get("name") or item.get("name_uz", "")
            code = str(item.get("code", hemis_id or ""))
            if not code:
                continue
            ReferenceData.objects.update_or_create(
                type="custom",
                code=f"spec_{code}",
                defaults={"name": name, "hemis_id": hemis_id, "name_uz": name},
            )
            count += 1
        self.stdout.write(f"  Synced {count} specialties")

    def _sync_groups(self, client: HemisClient) -> None:
        from apps.core.models import ReferenceData

        try:
            items = client.get_groups()
        except HemisError as exc:
            self.stderr.write(f"  groups: {exc}")
            return

        count = 0
        for item in items:
            hemis_id = item.get("id") or item.get("code")
            name = item.get("name") or item.get("name_uz", "")
            code = str(item.get("code", hemis_id or ""))
            if not code:
                continue
            ReferenceData.objects.update_or_create(
                type="custom",
                code=f"group_{code}",
                defaults={"name": name, "hemis_id": hemis_id, "name_uz": name},
            )
            count += 1
        self.stdout.write(f"  Synced {count} groups")

    def _sync_semesters(self, client: HemisClient) -> None:
        try:
            items = client.get_semesters()
        except HemisError as exc:
            self.stderr.write(f"  semesters: {exc}")
            return
        self.stdout.write(f"  Fetched {len(items)} semesters (no local mapping)")

    def _sync_subjects(self, client: HemisClient) -> None:
        try:
            items = client.get_subjects()
        except HemisError as exc:
            self.stderr.write(f"  subjects: {exc}")
            return
        self.stdout.write(f"  Fetched {len(items)} subjects (no local mapping)")

    def _sync_students(self, client: HemisClient) -> None:
        from apps.students.models import Student

        try:
            page = 1
            total = 0
            while True:
                result = client.get_students(page=page)
                items = result.get("data", result) if isinstance(result, dict) else result
                if not items:
                    break
                for item in items:
                    hemis_id = item.get("id")
                    if not hemis_id:
                        continue
                    Student.objects.filter(
                        student_id_number=item.get("studentIdNumber", "")
                    ).update(hemis_id=hemis_id)
                    total += 1
                if len(items) < 20:
                    break
                page += 1
        except HemisError as exc:
            self.stderr.write(f"  students: {exc}")
            return
        self.stdout.write(f"  Synced {total} students")

    def _sync_employees(self, client: HemisClient) -> None:
        from apps.hr.models import Employee

        try:
            items = client.get_employees()
        except HemisError as exc:
            self.stderr.write(f"  employees: {exc}")
            return

        count = 0
        for item in items:
            hemis_id = item.get("id")
            emp_id = item.get("employeeIdNumber", "")
            if hemis_id and emp_id:
                Employee.objects.filter(employee_id_number=emp_id).update(hemis_id=hemis_id)
                count += 1
        self.stdout.write(f"  Synced {count} employees")
