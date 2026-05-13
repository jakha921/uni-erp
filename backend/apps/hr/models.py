"""HR models — Employee, HrOrder, Leave."""

from django.db import models


class Employee(models.Model):
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("leave", "Ta'tilda"),
        ("business_trip", "Safarda"),
        ("inactive", "Ishlamaydi"),
    ]
    EMPLOYMENT_FORM_CHOICES = [
        ("asosiy", "Asosiy"),
        ("orindosh", "O'rindosh"),
        ("soatbay", "Soatbay"),
    ]
    GENDER_CHOICES = [
        ("male", "Erkak"),
        ("female", "Ayol"),
    ]
    DEGREE_CHOICES = [
        ("", "Yo'q"),
        ("phd", "PhD"),
        ("dsc", "DSc"),
        ("candidate", "Fan nomzodi"),
        ("doctor", "Fan doktori"),
    ]
    RANK_CHOICES = [
        ("", "Yo'q"),
        ("assistant", "Assistent"),
        ("dotsent", "Dotsent"),
        ("professor", "Professor"),
        ("katta_oqituvchi", "Katta o'qituvchi"),
    ]

    user = models.OneToOneField(
        "accounts.User", on_delete=models.CASCADE, related_name="employee_profile"
    )
    employee_id_number = models.CharField(max_length=20, unique=True)
    hemis_id = models.IntegerField(null=True, blank=True, db_index=True, verbose_name="HEMIS ID")
    department = models.ForeignKey(
        "core.Department", on_delete=models.PROTECT, null=True, blank=True, related_name="employees"
    )
    position = models.CharField(max_length=100)
    position_code = models.CharField(max_length=20, blank=True)
    academic_degree = models.CharField(max_length=30, blank=True, choices=DEGREE_CHOICES)
    academic_rank = models.CharField(max_length=30, blank=True, choices=RANK_CHOICES)
    employment_form = models.CharField(
        max_length=20, choices=EMPLOYMENT_FORM_CHOICES, default="asosiy"
    )
    hire_date = models.DateField()
    contract_number = models.CharField(max_length=30, blank=True)
    contract_date = models.DateField(null=True, blank=True)
    salary = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    passport = models.CharField(max_length=9, blank=True)
    pinfl = models.CharField(max_length=14, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["user__last_name", "user__first_name"]

    def __str__(self) -> str:
        return f"{self.employee_id_number} — {self.user.full_name}"


class HrOrder(models.Model):
    ORDER_TYPES = [
        ("hire", "Ishga qabul"),
        ("fire", "Ishdan bo'shatish"),
        ("transfer", "Ko'chirish"),
        ("promotion", "Lavozim oshirish"),
        ("salary_change", "Maosh o'zgartirish"),
        ("leave", "Ta'til"),
        ("business_trip", "Xizmat safari"),
        ("bonus", "Mukofot"),
        ("penalty", "Jazo"),
    ]
    STATUS_CHOICES = [
        ("draft", "Qoralama"),
        ("review", "Ko'rib chiqilmoqda"),
        ("signed", "Imzolangan"),
        ("cancelled", "Bekor qilingan"),
    ]

    number = models.CharField(max_length=30, unique=True)
    type = models.CharField(max_length=20, choices=ORDER_TYPES)
    title = models.CharField(max_length=200)
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="orders")
    date = models.DateField()
    effective_date = models.DateField()
    signer = models.CharField(max_length=100, blank=True)
    basis = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.number} — {self.title}"


class Leave(models.Model):
    LEAVE_TYPES = [
        ("annual", "Mehnat ta'tili"),
        ("sick", "Kasallik"),
        ("maternity", "Dekret"),
        ("unpaid", "Haq to'lanmaydigan"),
        ("business_trip", "Xizmat safari"),
        ("study", "O'quv"),
    ]
    STATUS_CHOICES = [
        ("pending", "Kutilmoqda"),
        ("approved", "Tasdiqlangan"),
        ("rejected", "Rad etilgan"),
    ]

    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name="leaves")
    type = models.CharField(max_length=20, choices=LEAVE_TYPES)
    start_date = models.DateField()
    end_date = models.DateField()
    days = models.PositiveSmallIntegerField()
    destination = models.CharField(max_length=200, blank=True)
    reason = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return f"{self.employee} — {self.type} ({self.start_date})"
