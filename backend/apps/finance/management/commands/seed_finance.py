"""Seed 30 contracts with payment schedules and 45 payments."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.core.models import AcademicYear
from apps.finance.models import Contract, Payment, PaymentScheduleItem
from apps.students.models import Student


class Command(BaseCommand):
    help = "Seed finance data: 30 contracts, payment schedules, 45 payments"

    def handle(self, *args, **options):
        rng = random.Random(99)
        students = list(Student.objects.filter(status="active", payment_form="kontrakt")[:30])
        if not students:
            students = list(Student.objects.filter(status="active")[:30])
        if not students:
            self.stdout.write(self.style.ERROR("No students. Run seed_students first."))
            return

        year = AcademicYear.objects.filter(is_current=True).first()
        CONTRACT_TYPES = ["bazoviy", "tabaqalashtirilgan", "grant", "xorijiy"]
        AMOUNTS = [8_500_000, 9_000_000, 10_500_000, 12_000_000, 15_000_000]
        METHODS = ["bank", "naqd", "online", "click", "payme"]

        created_contracts = 0
        for i, student in enumerate(students):
            if Contract.objects.filter(student=student, academic_year=year).exists():
                continue
            amount = rng.choice(AMOUNTS)
            contract_date = date(2025, 9, 1) + timedelta(days=rng.randint(0, 30))
            contract = Contract.objects.create(
                contract_number=f"CNT-2025-{i + 1:04d}",
                student=student,
                academic_year=year,
                contract_type=rng.choice(CONTRACT_TYPES),
                contract_amount=amount,
                debt_amount=amount,
                contract_date=contract_date,
                due_date=date(2026, 6, 30),
            )
            # 2 payment schedule items
            installment = amount // 2
            for m in [10, 3]:
                PaymentScheduleItem.objects.create(
                    contract=contract,
                    due_date=date(2025 if m == 10 else 2026, m, 1),
                    amount=installment,
                )
            created_contracts += 1

        # 45 payments spread across contracts
        contracts = list(Contract.objects.all()[:30])
        created_payments = 0
        for i in range(45):
            contract = rng.choice(contracts)
            payment_pct = rng.uniform(0.3, 1.0)
            amount = round(float(contract.contract_amount) * payment_pct * 0.5, 2)
            Payment.objects.create(
                contract=contract,
                amount=amount,
                payment_date=date(2025, rng.randint(9, 12), rng.randint(1, 28)),
                payment_method=rng.choice(METHODS),
                receipt_number=f"REC-{i + 1:04d}",
            )
            created_payments += 1

        # Recalculate all contracts
        for contract in Contract.objects.all():
            contract.recalculate()
            contract.save(update_fields=["paid_amount", "debt_amount", "status"])

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {created_contracts} contracts, {created_payments} payments."
            )
        )
