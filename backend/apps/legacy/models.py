"""Legacy models — archived orders and staffing from old system."""

from django.db import models

from apps.core.models import BaseModel


class LegacyOrder(BaseModel):
    TYPE_CHOICES = [
        ("hire", "Qabul"),
        ("fire", "Bo'shatish"),
        ("reward", "Mukofot"),
        ("leave", "Ta'til"),
        ("penalty", "Jazo"),
    ]
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("archived", "Arxivlangan"),
    ]

    number = models.CharField(max_length=50, verbose_name="Raqam")
    date = models.DateField(verbose_name="Sana")
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    type_label = models.CharField(max_length=50, blank=True)
    employee_name = models.CharField(max_length=200, verbose_name="Xodim")
    department = models.CharField(max_length=200, verbose_name="Bo'lim")
    content = models.TextField(blank=True, verbose_name="Mazmun")
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="archived")

    class Meta:
        verbose_name = "Eski buyruq"
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.number} - {self.employee_name}"


class StaffingPosition(BaseModel):
    department_name = models.CharField(max_length=200, verbose_name="Bo'lim")
    position_name = models.CharField(max_length=200, verbose_name="Lavozim")
    total_slots = models.IntegerField(default=1, verbose_name="Jami birliklar")
    filled_slots = models.IntegerField(default=0, verbose_name="Band birliklar")
    salary = models.DecimalField(max_digits=15, decimal_places=2, default=0, verbose_name="Maosh")

    class Meta:
        verbose_name = "Shtat birligi"
        ordering = ["department_name", "position_name"]

    def __str__(self) -> str:
        return f"{self.department_name} - {self.position_name}"
