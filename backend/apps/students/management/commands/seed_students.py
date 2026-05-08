"""Seed 200 students across all groups with realistic Uzbek data."""

import random
from datetime import date

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.core.models import Group
from apps.students.models import Student

MALE_NAMES = [
    "Jasur",
    "Aziz",
    "Bekzod",
    "Sardor",
    "Otabek",
    "Davron",
    "Rustam",
    "Sherzod",
    "Kamoliddin",
    "Akmal",
    "Javohir",
    "Nodir",
    "Bobur",
    "Oybek",
    "Shavkat",
    "Dilshod",
]
FEMALE_NAMES = [
    "Nilufar",
    "Malika",
    "Dilnoza",
    "Shahnoza",
    "Mohira",
    "Zarina",
    "Gulnora",
    "Madina",
    "Feruza",
    "Sevinch",
    "Muhayyo",
    "Kamola",
    "Nozima",
    "Laylo",
]
SURNAMES = [
    "Aliyev",
    "Karimov",
    "Yusupov",
    "Rahimov",
    "Nazarov",
    "Tursunov",
    "Shodiyev",
    "Mirzayev",
    "Xolmatov",
    "Saidov",
    "Ergashev",
    "Jalilov",
    "Hasanov",
    "Qodirov",
]
PATRONYMICS = [
    "Kamoliddinovich",
    "Bahodirovich",
    "Rashidovich",
    "Sobirovich",
    "Mahmudovich",
    "Abdullayevich",
    "Nematovich",
    "Shokirovich",
]

PHONE_CODES = ["90", "91", "93", "94", "97", "99"]


class Command(BaseCommand):
    help = "Seed 200 students with realistic data"

    def handle(self, *args, **options):
        rng = random.Random(42)
        groups = list(Group.objects.select_related("specialty__department__faculty").all())
        if not groups:
            self.stdout.write(self.style.ERROR("No groups found. Run seed_core first."))
            return

        created = 0
        for i in range(200):
            is_female = rng.random() < 0.45
            first = rng.choice(FEMALE_NAMES if is_female else MALE_NAMES)
            last = rng.choice(SURNAMES) + ("a" if is_female else "")
            middle = rng.choice(PATRONYMICS)
            phone = f"+998{rng.choice(PHONE_CODES)}{rng.randint(1000000, 9999999)}"
            email = f"{last.lower()}.{first[0].lower()}{i}@uni.uz"

            if User.objects.filter(phone=phone).exists():
                phone = f"+998{rng.choice(PHONE_CODES)}{rng.randint(1000000, 9999999)}"

            group = rng.choice(groups)
            birth_year = rng.randint(1999, 2005)
            enrollment_year = birth_year + 18
            enrollment_date = date(enrollment_year, 9, 1)
            birth_date = date(birth_year, rng.randint(1, 12), rng.randint(1, 28))

            student_id = f"ST-{enrollment_year}-{i + 1:04d}"
            if Student.objects.filter(student_id_number=student_id).exists():
                continue

            try:
                user = User.objects.create_user(
                    phone=phone,
                    password="student123",
                    first_name=first,
                    last_name=last,
                    middle_name=middle,
                    email=email,
                )
                Student.objects.create(
                    user=user,
                    student_id_number=student_id,
                    group=group,
                    course=group.course,
                    level="bakalavr",
                    education_type=rng.choice(["kontrakt", "grant"]),
                    payment_form=rng.choice(["kontrakt", "grant"]),
                    education_form=rng.choice(["kunduzgi", "sirtqi"]),
                    enrollment_date=enrollment_date,
                    birth_date=birth_date,
                    gender="female" if is_female else "male",
                    status=rng.choices(
                        ["active", "academic_leave", "expelled", "graduated"],
                        weights=[85, 5, 5, 5],
                    )[0],
                    avg_grade=round(rng.uniform(55, 95), 2),
                    passport=f"AA{rng.randint(1000000, 9999999)}",
                    pinfl=str(rng.randint(10000000000000, 99999999999999)),
                    address=f"Toshkent, {rng.randint(1, 100)}-uy",
                )
                created += 1
            except Exception as e:
                self.stdout.write(f"  Skip student {i}: {e}")

        self.stdout.write(self.style.SUCCESS(f"Created {created} students."))
