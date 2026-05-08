"""Seed core reference data — Branch, Faculties, Departments, Specialties, Groups, AcademicYears."""

from django.core.management.base import BaseCommand

from apps.core.models import (
    AcademicYear,
    Branch,
    Department,
    Faculty,
    Group,
    Semester,
    Specialty,
)

FACULTIES_DATA = [
    {"name": "Axborot texnologiyalari", "code": "AT"},
    {"name": "Iqtisodiyot va menejment", "code": "IM"},
    {"name": "Pedagogika", "code": "PED"},
    {"name": "Filologiya", "code": "FIL"},
    {"name": "Energetika", "code": "EN"},
]

DEPARTMENTS_DATA = {
    "AT": [
        {"name": "Dasturiy injiniring kafedrasi", "code": "DI"},
        {"name": "Axborot tizimlari kafedrasi", "code": "AT"},
        {"name": "Kibertexnologiyalar kafedrasi", "code": "KT"},
    ],
    "IM": [
        {"name": "Iqtisodiyot nazariyasi kafedrasi", "code": "IN"},
        {"name": "Menejment kafedrasi", "code": "MEN"},
        {"name": "Marketing kafedrasi", "code": "MAR"},
    ],
    "PED": [
        {"name": "Pedagogika va psixologiya kafedrasi", "code": "PP"},
        {"name": "Boshlang'ich ta'lim kafedrasi", "code": "BT"},
        {"name": "Jismoniy tarbiya kafedrasi", "code": "JT"},
    ],
    "FIL": [
        {"name": "O'zbek tili va adabiyoti kafedrasi", "code": "OTL"},
        {"name": "Xorijiy tillar kafedrasi", "code": "XT"},
        {"name": "Rus tili kafedrasi", "code": "RT"},
    ],
    "EN": [
        {"name": "Energetika kafedrasi", "code": "ENK"},
        {"name": "Elektrotexnika kafedrasi", "code": "ELT"},
        {"name": "Yadro fizikasi kafedrasi", "code": "YF"},
    ],
}

SPECIALTIES_DATA = {
    "DI": [{"name": "Dasturiy injiniring", "code": "60610200", "level": "bakalavr"}],
    "AT": [{"name": "Axborot tizimlari", "code": "60610300", "level": "bakalavr"}],
    "KT": [{"name": "Kibertexnologiyalar", "code": "60610400", "level": "bakalavr"}],
    "IN": [{"name": "Iqtisodiyot", "code": "60340100", "level": "bakalavr"}],
    "MEN": [{"name": "Menejment", "code": "60340200", "level": "bakalavr"}],
    "MAR": [{"name": "Marketing", "code": "60340300", "level": "bakalavr"}],
    "PP": [{"name": "Pedagogika va psixologiya", "code": "60110100", "level": "bakalavr"}],
    "BT": [{"name": "Boshlang'ich ta'lim", "code": "60110200", "level": "bakalavr"}],
    "JT": [{"name": "Jismoniy tarbiya", "code": "60140100", "level": "bakalavr"}],
    "OTL": [{"name": "O'zbek tili va adabiyoti", "code": "60220100", "level": "bakalavr"}],
    "XT": [{"name": "Xorijiy filologiya", "code": "60220200", "level": "bakalavr"}],
    "RT": [{"name": "Rus tili va adabiyoti", "code": "60220300", "level": "bakalavr"}],
    "ENK": [{"name": "Energetika", "code": "60520100", "level": "bakalavr"}],
    "ELT": [{"name": "Elektrotexnika", "code": "60520200", "level": "bakalavr"}],
    "YF": [{"name": "Yadro fizikasi", "code": "60520300", "level": "bakalavr"}],
}


class Command(BaseCommand):
    help = "Seed core reference data (Branch, Faculties, Departments, Specialties, Groups)"

    def handle(self, *args, **options):
        self.stdout.write("Seeding core data...")

        branch, _ = Branch.objects.get_or_create(
            code="bitu",
            defaults={
                "name": "BITU",
                "address": "Toshkent, Universitet ko'chasi 4",
                "is_active": True,
            },
        )
        self.stdout.write(f"  Branch: {branch.name}")

        # Academic years
        year_2024, _ = AcademicYear.objects.get_or_create(
            name="2024-2025",
            branch=branch,
            defaults={"start_date": "2024-09-01", "end_date": "2025-06-30", "is_current": False},
        )
        year_2025, _ = AcademicYear.objects.get_or_create(
            name="2025-2026",
            branch=branch,
            defaults={"start_date": "2025-09-01", "end_date": "2026-06-30", "is_current": True},
        )
        for year, semesters in [
            (year_2024, [("2024-09-01", "2025-01-31"), ("2025-02-01", "2025-06-30")]),
            (year_2025, [("2025-09-01", "2026-01-31"), ("2026-02-01", "2026-06-30")]),
        ]:
            for num, (start, end) in enumerate(semesters, 1):
                Semester.objects.get_or_create(
                    academic_year=year,
                    number=num,
                    defaults={"start_date": start, "end_date": end},
                )
        self.stdout.write("  Academic years: 2024-2025, 2025-2026")

        # Faculties, Departments, Specialties, Groups
        group_counter = 1
        for fac_data in FACULTIES_DATA:
            faculty, _ = Faculty.objects.get_or_create(
                code=fac_data["code"], branch=branch, defaults={"name": fac_data["name"]}
            )
            dept_list = DEPARTMENTS_DATA[fac_data["code"]]
            for dept_data in dept_list:
                dept, _ = Department.objects.get_or_create(
                    code=dept_data["code"],
                    faculty=faculty,
                    defaults={"name": dept_data["name"]},
                )
                for spec_data in SPECIALTIES_DATA.get(dept_data["code"], []):
                    spec, _ = Specialty.objects.get_or_create(
                        code=spec_data["code"],
                        department=dept,
                        defaults={"name": spec_data["name"], "level": spec_data["level"]},
                    )
                    prefix = fac_data["code"][:2]
                    for course in range(1, 5):
                        for grp_idx in range(1, 3):
                            grp_name = f"{prefix}-{(21 + (5 - course)):02d}-{grp_idx}"
                            Group.objects.get_or_create(
                                name=grp_name,
                                specialty=spec,
                                defaults={
                                    "course": course,
                                    "education_form": "kunduzgi",
                                    "max_students": 25,
                                },
                            )
                            group_counter += 1

        total_faculties = Faculty.objects.count()
        total_depts = Department.objects.count()
        total_groups = Group.objects.count()
        self.stdout.write(
            f"  Faculties: {total_faculties}, Departments: {total_depts}, Groups: {total_groups}"
        )
        self.stdout.write(self.style.SUCCESS("Core data seeded successfully."))
