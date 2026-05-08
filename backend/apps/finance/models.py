"""Finance models — Contract, PaymentScheduleItem, Payment, Scholarship."""

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
