"""Seed Warehouse data: items and stock movements."""

import random

from django.core.management.base import BaseCommand

from apps.warehouse.models import StockMovement, WarehouseItem

ITEMS = [
    ("Qog'oz A4", "office", "pachka", 500),
    ("Ruchka ko'k", "office", "dona", 100),
    ("Marker doska uchun", "office", "dona", 200),
    ("Yelim PVA", "office", "dona", 300),
    ("Salfetka", "cleaning", "pachka", 150),
    ("Dezinfeksiya vositasi", "cleaning", "litr", 800),
    ("Cho'tka", "cleaning", "dona", 200),
    ("Axlat qopi", "cleaning", "rulon", 100),
    ("Kabel USB", "technical", "dona", 500),
    ("Flesh xotira 32GB", "technical", "dona", 1200),
    ("Stol lampa", "furniture", "dona", 15000),
    ("Ofis stuli", "furniture", "dona", 80000),
    ("Choy", "food", "pachka", 3000),
    ("Shakar", "food", "kg", 1500),
    ("Kofe", "food", "pachka", 8000),
    ("Suv 5L", "food", "dona", 2500),
]


class Command(BaseCommand):
    help = "Seed warehouse data"

    def handle(self, *args, **options):
        if WarehouseItem.objects.exists():
            self.stdout.write("Warehouse data already exists, skipping.")
            return

        items = []
        for i, (name, cat, unit, price) in enumerate(ITEMS):
            qty = random.randint(5, 200)
            min_qty = random.randint(5, 20)
            items.append(
                WarehouseItem(
                    name=name,
                    sku=f"WH-{i + 1:04d}",
                    category=cat,
                    quantity=qty,
                    unit=unit,
                    min_quantity=min_qty,
                    price=price,
                    location=random.choice(["Asosiy ombor", "Yordamchi ombor", "1-bino ombori"]),
                )
            )
        WarehouseItem.objects.bulk_create(items)

        # Some movements
        created_items = list(WarehouseItem.objects.all())
        movements = []
        for item in created_items:
            for _ in range(random.randint(1, 4)):
                movements.append(
                    StockMovement(
                        item=item,
                        type=random.choice(["incoming", "outgoing", "incoming"]),
                        quantity=random.randint(5, 50),
                        note=random.choice(
                            [
                                "Yangi partiya",
                                "Bo'limga berildi",
                                "Ombor to'ldirish",
                                "",
                            ]
                        ),
                        responsible_person=random.choice(["Karimov A.", "Rahimova S."]),
                    )
                )
        StockMovement.objects.bulk_create(movements)

        self.stdout.write(
            self.style.SUCCESS(f"Created {len(items)} items, {len(movements)} movements")
        )
