"""Admin Panel models — Folder, Document, DictionaryItem."""

from django.db import models


class Folder(models.Model):
    name = models.CharField(max_length=200)
    parent = models.ForeignKey(
        "self", on_delete=models.CASCADE, null=True, blank=True, related_name="children"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Document(models.Model):
    CATEGORY_CHOICES = [
        ("order", "Buyruq"),
        ("contract", "Shartnoma"),
        ("report", "Hisobot"),
        ("certificate", "Sertifikat"),
        ("other", "Boshqa"),
    ]
    PRIORITY_CHOICES = [
        ("low", "Past"),
        ("medium", "O'rta"),
        ("high", "Yuqori"),
        ("urgent", "Shoshilinch"),
    ]
    STATUS_CHOICES = [
        ("draft", "Loyiha"),
        ("active", "Faol"),
        ("archived", "Arxivlangan"),
    ]

    title = models.CharField(max_length=300)
    number = models.CharField(max_length=50, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
    folder = models.ForeignKey(
        Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name="documents"
    )
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    author = models.ForeignKey(
        "accounts.User", on_delete=models.SET_NULL, null=True, related_name="documents"
    )
    file = models.FileField(upload_to="documents/", null=True, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.number} — {self.title}" if self.number else self.title


class DictionaryItem(models.Model):
    """Справочник / lookup items, сгруппированные по type."""

    type = models.CharField(max_length=50)
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["type", "code"]
        ordering = ["type", "sort_order", "name"]

    def __str__(self) -> str:
        return f"[{self.type}] {self.code} — {self.name}"
