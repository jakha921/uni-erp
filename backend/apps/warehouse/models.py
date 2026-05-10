"""Warehouse models — inventory items and stock movements."""

from django.db import models

from apps.core.models import BaseModel


class WarehouseItem(BaseModel):
    CATEGORY_CHOICES = [
        ("office", "Ofis"),
        ("cleaning", "Tozalash"),
        ("technical", "Texnik"),
        ("furniture", "Mebel"),
        ("food", "Oziq-ovqat"),
        ("other", "Boshqa"),
    ]

    name = models.CharField(max_length=300, verbose_name="Nomi")
    sku = models.CharField(max_length=50, unique=True, verbose_name="Artikul")
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES, default="other")
    quantity = models.IntegerField(default=0, verbose_name="Miqdori")
    unit = models.CharField(max_length=20, verbose_name="Birlik")
    min_quantity = models.IntegerField(default=0, verbose_name="Minimal miqdor")
    price = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Narxi")
    location = models.CharField(max_length=100, blank=True, verbose_name="Joylashuv")

    class Meta:
        verbose_name = "Ombor buyumi"
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.sku})"

    @property
    def total_value(self):
        return self.quantity * self.price


class StockMovement(BaseModel):
    TYPE_CHOICES = [
        ("incoming", "Kirim"),
        ("outgoing", "Chiqim"),
        ("write_off", "Hisobdan chiqarish"),
        ("transfer", "Ko'chirish"),
    ]

    item = models.ForeignKey(WarehouseItem, on_delete=models.CASCADE, related_name="movements")
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    quantity = models.IntegerField()
    note = models.TextField(blank=True)
    responsible_person = models.CharField(max_length=200, blank=True)

    class Meta:
        verbose_name = "Ombor harakati"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.get_type_display()} - {self.item.name}: {self.quantity}"
