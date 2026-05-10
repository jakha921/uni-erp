"""CRM models — Lead tracking for student recruitment."""

from django.db import models

from apps.core.models import BaseModel


class Lead(BaseModel):
    """Prospective student lead for CRM pipeline."""

    STATUS_CHOICES = [
        ("new", "Yangi"),
        ("contacted", "Bog'lanildi"),
        ("interested", "Qiziqgan"),
        ("applied", "Ariza to'ldirdi"),
        ("enrolled", "O'qishga qabul qilindi"),
        ("rejected", "Rad etildi"),
    ]
    SOURCE_CHOICES = [
        ("website", "Veb-sayt"),
        ("telegram", "Telegram"),
        ("instagram", "Instagram"),
        ("referral", "Tavsiya"),
        ("event", "Tadbir"),
        ("call", "Qo'ng'iroq"),
    ]

    first_name = models.CharField(max_length=100, verbose_name="Ism")
    last_name = models.CharField(max_length=100, verbose_name="Familiya")
    phone = models.CharField(max_length=20, verbose_name="Telefon")
    email = models.EmailField(blank=True, verbose_name="Email")
    direction = models.CharField(max_length=200, verbose_name="Yo'nalish")
    source = models.CharField(
        max_length=20, choices=SOURCE_CHOICES, default="website", verbose_name="Manba"
    )
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="new", verbose_name="Holat"
    )
    assignee = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_leads",
        verbose_name="Mas'ul",
    )
    notes = models.TextField(blank=True, verbose_name="Izohlar")
    score = models.IntegerField(default=0, verbose_name="Ball")
    last_contact_date = models.DateField(null=True, blank=True, verbose_name="Oxirgi aloqa")
    next_contact_date = models.DateField(null=True, blank=True, verbose_name="Keyingi aloqa")
    is_deleted = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Lid"
        verbose_name_plural = "Lidlar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.first_name} {self.last_name}"
