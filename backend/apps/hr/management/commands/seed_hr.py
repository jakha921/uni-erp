"""Seed HR data: employees, orders, leaves."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.core.models import Department
from apps.hr.models import Employee, HrOrder, Leave

POSITIONS = [
    ("Dotsent", "dotsent"),
    ("Professor", "professor"),
    ("Assistent", "assistent"),
    ("Katta o'qituvchi", "katta_oqituvchi"),
    ("Laborant", "laborant"),
    ("Dekan", "dekan"),
    ("Prorektor", "prorektor"),
    ("Kafedra mudiri", "mudiri"),
]

FIRST_NAMES = [
    "Jasur",
    "Akbar",
    "Sherzod",
    "Bobur",
    "Ulugbek",
    "Dilnoza",
    "Malika",
    "Gulnora",
    "Feruza",
    "Mohira",
    "Sardor",
    "Timur",
    "Rustam",
    "Nodir",
    "Eldor",
    "Nilufar",
    "Zulfiya",
    "Barno",
    "Nargiza",
    "Kamola",
]

LAST_NAMES = [
    "Karimov",
    "Rahimov",
    "Toshmatov",
    "Yusupov",
    "Xolmatov",
    "Ergashev",
    "Nazarov",
    "Mirzayev",
    "Hasanov",
    "Botirov",
    "Salimov",
    "Qodirov",
    "Ismoilov",
    "Abdullayev",
    "Normatov",
]

MIDDLE_NAMES = [
    "Aliyevich",
    "Raximovich",
    "Toshevich",
    "Norqo'ziyevich",
    "Xoliqovich",
    "Aliyevna",
    "Raximovna",
    "Toshevna",
    "Norqo'ziyevna",
    "Xoliqovna",
]


class Command(BaseCommand):
    help = "Seed HR data: employees, orders, leaves"

    def handle(self, *args, **options):
        rng = random.Random(42)
        departments = list(Department.objects.all())
        if not departments:
            self.stdout.write(self.style.ERROR("Run seed_core first."))
            return

        created_employees = 0
        employees = []
        start_emp_count = Employee.objects.count()

        for i in range(1, 51):
            gender = rng.choice(["male", "female"])
            first_names = FIRST_NAMES[:10] if gender == "male" else FIRST_NAMES[10:]
            middle_names = MIDDLE_NAMES[:5] if gender == "male" else MIDDLE_NAMES[5:]
            first_name = rng.choice(first_names)
            last_name = rng.choice(LAST_NAMES)
            middle_name = rng.choice(middle_names)
            phone = f"+99890{rng.randint(1000000, 9999999)}"

            if User.objects.filter(phone=phone).exists():
                phone = f"+99891{i:07d}"

            user, _ = User.objects.get_or_create(
                phone=phone,
                defaults={
                    "first_name": first_name,
                    "last_name": last_name,
                    "middle_name": middle_name,
                },
            )

            if hasattr(user, "employee_profile"):
                employees.append(user.employee_profile)
                continue

            dept = rng.choice(departments)
            pos_name, pos_code = rng.choice(POSITIONS)
            hire_date = date(rng.randint(2015, 2023), rng.randint(1, 12), rng.randint(1, 28))
            count = start_emp_count + created_employees + 1

            emp = Employee.objects.create(
                user=user,
                employee_id_number=f"EMP-{count:04d}",
                department=dept,
                position=pos_name,
                position_code=pos_code,
                academic_degree=rng.choice(["", "phd", "dsc", "candidate", "doctor"]),
                academic_rank=rng.choice(
                    ["", "assistant", "dotsent", "professor", "katta_oqituvchi"]
                ),
                employment_form=rng.choice(["asosiy", "orindosh", "soatbay"]),
                hire_date=hire_date,
                birth_date=date(rng.randint(1970, 1995), rng.randint(1, 12), rng.randint(1, 28)),
                gender=gender,
                salary=rng.randint(2_000_000, 15_000_000),
                status=rng.choices(
                    ["active", "leave", "business_trip", "inactive"],
                    weights=[80, 8, 8, 4],
                )[0],
            )
            employees.append(emp)
            created_employees += 1

        self.stdout.write(f"  Employees: {created_employees} created ({len(employees)} total)")

        # Create orders
        order_count = HrOrder.objects.count()
        created_orders = 0
        for emp in rng.sample(employees, min(30, len(employees))):
            o_type = rng.choice(["hire", "transfer", "promotion", "salary_change", "bonus"])
            order_count += 1
            order_date = date(rng.randint(2023, 2025), rng.randint(1, 12), rng.randint(1, 28))
            HrOrder.objects.get_or_create(
                number=f"HR-{order_count:04d}",
                defaults={
                    "type": o_type,
                    "title": f"{dict(HrOrder.ORDER_TYPES)[o_type]} — {emp.user.full_name}",
                    "employee": emp,
                    "date": order_date,
                    "effective_date": order_date + timedelta(days=1),
                    "status": rng.choice(["draft", "signed"]),
                },
            )
            created_orders += 1

        self.stdout.write(f"  Orders: {created_orders} created")

        # Create leaves
        created_leaves = 0
        for emp in rng.sample(employees, min(20, len(employees))):
            start = date(2025, rng.randint(1, 6), rng.randint(1, 28))
            days = rng.randint(7, 30)
            Leave.objects.get_or_create(
                employee=emp,
                type=rng.choice(["annual", "sick", "study"]),
                start_date=start,
                defaults={
                    "end_date": start + timedelta(days=days),
                    "days": days,
                    "status": rng.choice(["pending", "approved"]),
                },
            )
            created_leaves += 1

        self.stdout.write(f"  Leaves: {created_leaves} created")
        self.stdout.write(self.style.SUCCESS("HR data seeded successfully."))
