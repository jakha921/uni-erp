"""Finance models — Contract, PaymentScheduleItem, Payment, Scholarship, PayrollRecord, BudgetCategory."""

from django.db import models
from django.db.models import Sum


class Contract(models.Model):
    CONTRACT_TYPES = [
        ("bazoviy", "Bazoviy"),
        ("tabaqalashtirilgan", "Tabaqalashtirilgan"),
        ("grant", "Grant"),
        ("xorijiy", "Xorijiy"),
    ]
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("completed", "To'langan"),
        ("cancelled", "Bekor qilingan"),
    ]

    contract_number = models.CharField(max_length=30, unique=True, db_index=True)
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="contracts"
    )
    academic_year = models.ForeignKey(
        "core.AcademicYear", on_delete=models.PROTECT, null=True, blank=True
    )
    contract_type = models.CharField(max_length=30, choices=CONTRACT_TYPES)
    contract_amount = models.DecimalField(max_digits=14, decimal_places=2)
    paid_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    debt_amount = models.DecimalField(max_digits=14, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="active", db_index=True
    )
    contract_date = models.DateField()
    due_date = models.DateField()
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-contract_date"]

    def recalculate(self) -> None:
        total = self.payments.aggregate(total=Sum("amount"))["total"] or 0
        self.paid_amount = total
        self.debt_amount = self.contract_amount - total
        if self.debt_amount <= 0:
            self.status = "completed"
            self.debt_amount = max(self.debt_amount, 0)
        elif self.status == "completed":
            self.status = "active"

    def __str__(self) -> str:
        return self.contract_number


class PaymentScheduleItem(models.Model):
    STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("paid", "To'langan"),
        ("overdue", "Muddati o'tgan"),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="schedule_items")
    due_date = models.DateField()
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    paid_date = models.DateField(null=True, blank=True)

    class Meta:
        ordering = ["due_date"]

    def __str__(self) -> str:
        return f"{self.contract.contract_number} — {self.due_date}"


class Payment(models.Model):
    METHODS = [
        ("bank", "Bank o'tkazmasi"),
        ("naqd", "Naqd"),
        ("online", "Online"),
        ("click", "Click"),
        ("payme", "Payme"),
    ]

    contract = models.ForeignKey(Contract, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=14, decimal_places=2)
    payment_date = models.DateTimeField()
    payment_method = models.CharField(max_length=20, choices=METHODS)
    receipt_number = models.CharField(max_length=30, blank=True)
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-payment_date"]

    def __str__(self) -> str:
        return f"{self.contract.contract_number} — {self.amount}"


class Scholarship(models.Model):
    TYPES = [
        ("davlat", "Davlat"),
        ("ijtimoiy", "Ijtimoiy"),
        ("fanlar", "Fan bo'yicha"),
        ("prezident", "Prezident"),
        ("maxsus", "Maxsus"),
    ]
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("paused", "To'xtatilgan"),
        ("completed", "Tugallangan"),
    ]

    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="scholarships"
    )
    semester = models.ForeignKey("core.Semester", on_delete=models.PROTECT, null=True, blank=True)
    type = models.CharField(max_length=20, choices=TYPES)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    basis = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return f"{self.student} — {self.type}"


class PayrollRecord(models.Model):
    """Ish haqi yozuvi."""

    STATUS_CHOICES = [
        ("draft", "Loyiha"),
        ("processed", "Hisoblangan"),
        ("paid", "To'langan"),
    ]

    employee = models.ForeignKey(
        "hr.Employee", on_delete=models.CASCADE, related_name="payroll_records"
    )
    period_year = models.PositiveSmallIntegerField()
    period_month = models.PositiveSmallIntegerField()
    base_salary = models.DecimalField(max_digits=12, decimal_places=2)
    bonus = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    deductions = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    net_salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    paid_date = models.DateField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["employee", "period_year", "period_month"]
        ordering = ["-period_year", "-period_month"]

    def __str__(self) -> str:
        return f"{self.employee} — {self.period_year}/{self.period_month:02d}"

    def calculate_net(self) -> None:
        self.net_salary = self.base_salary + self.bonus - self.deductions
        self.save(update_fields=["net_salary"])


class BudgetCategory(models.Model):
    """Byudjet kategoriyasi (daraxtli tuzilma)."""

    PERIOD_CHOICES = [
        ("Q1", "1-chorak"),
        ("Q2", "2-chorak"),
        ("Q3", "3-chorak"),
        ("Q4", "4-chorak"),
        ("annual", "Yillik"),
    ]

    name = models.CharField(max_length=200)
    code = models.CharField(max_length=20, blank=True)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    year = models.PositiveSmallIntegerField()
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES, default="annual")
    planned_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    actual_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["year", "name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.year})"

    @property
    def remaining(self) -> float:
        return float(self.planned_amount - self.actual_amount)

    @property
    def percent_used(self) -> float:
        if not self.planned_amount:
            return 0.0
        return round(float(self.actual_amount / self.planned_amount * 100), 1)
