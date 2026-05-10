"""Infrastructure models — Dormitory, Equipment, Transport."""

from django.db import models

from apps.core.models import BaseModel


class DormBuilding(BaseModel):
    name = models.CharField(max_length=200, verbose_name="Nomi")
    address = models.TextField(blank=True, verbose_name="Manzil")
    floors = models.IntegerField(default=1, verbose_name="Qavatlar soni")
    total_rooms = models.IntegerField(default=0, verbose_name="Xonalar soni")

    class Meta:
        verbose_name = "Yotoqxona binosi"
        verbose_name_plural = "Yotoqxona binolari"

    def __str__(self) -> str:
        return self.name


class DormRoom(BaseModel):
    STATUS_CHOICES = [
        ("available", "Bosh"),
        ("partial", "Qisman to'la"),
        ("full", "To'la"),
        ("repair", "Ta'mirda"),
    ]
    building = models.ForeignKey(DormBuilding, on_delete=models.CASCADE, related_name="rooms")
    number = models.IntegerField(verbose_name="Xona raqami")
    floor = models.IntegerField(default=1, verbose_name="Qavat")
    capacity = models.IntegerField(default=4, verbose_name="Sig'imi")
    occupied = models.IntegerField(default=0, verbose_name="Band")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="available")

    class Meta:
        verbose_name = "Yotoqxona xonasi"
        unique_together = ["building", "number"]

    def __str__(self) -> str:
        return f"{self.building.name} - {self.number}"


class Equipment(BaseModel):
    STATUS_CHOICES = [
        ("working", "Ishlamoqda"),
        ("repair", "Ta'mirda"),
        ("written_off", "Hisobdan chiqarilgan"),
        ("storage", "Omborda"),
    ]
    name = models.CharField(max_length=300, verbose_name="Nomi")
    inventory_number = models.CharField(max_length=50, unique=True, verbose_name="Inventar raqami")
    category = models.CharField(max_length=100, verbose_name="Turkum")
    location = models.CharField(max_length=200, verbose_name="Joylashuv")
    responsible_person = models.CharField(max_length=200, verbose_name="Javobgar shaxs")
    purchase_date = models.DateField(verbose_name="Sotib olingan sana")
    cost = models.DecimalField(max_digits=15, decimal_places=2, verbose_name="Narxi")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="working")
    last_maintenance_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Jihoz"
        verbose_name_plural = "Jihozlar"
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.name} ({self.inventory_number})"


class Vehicle(BaseModel):
    STATUS_CHOICES = [
        ("available", "Faol"),
        ("in_use", "Foydalanishda"),
        ("repair", "Ta'mirda"),
        ("decommissioned", "Nofaol"),
    ]
    brand = models.CharField(max_length=100, verbose_name="Marka")
    model = models.CharField(max_length=100, verbose_name="Model")
    plate_number = models.CharField(max_length=20, unique=True, verbose_name="Davlat raqami")
    year = models.IntegerField(verbose_name="Ishlab chiqarilgan yil")
    driver_name = models.CharField(max_length=200, verbose_name="Haydovchi")
    route = models.CharField(max_length=300, blank=True, verbose_name="Yo'nalish")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="available")
    mileage = models.IntegerField(default=0, verbose_name="Yurgan masofasi")
    last_service_date = models.DateField(null=True, blank=True)

    class Meta:
        verbose_name = "Transport"
        verbose_name_plural = "Transport vositalari"

    def __str__(self) -> str:
        return f"{self.brand} {self.model} ({self.plate_number})"
