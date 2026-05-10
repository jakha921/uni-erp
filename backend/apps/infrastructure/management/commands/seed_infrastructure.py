"""Seed Infrastructure data: dormitory, equipment, transport."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.infrastructure.models import DormBuilding, DormRoom, Equipment, Vehicle

BUILDING_NAMES = ["1-yotoqxona", "2-yotoqxona", "3-yotoqxona"]
EQUIPMENT_NAMES = [
    ("Projektor Epson EB-X51", "Texnik"),
    ("Kompyuter Dell OptiPlex", "Texnik"),
    ("Printer HP LaserJet", "Texnik"),
    ("Doska interaktiv", "Texnik"),
    ("Stol ofis", "Mebel"),
    ("Stul ofis", "Mebel"),
    ("Shkaf kitob", "Mebel"),
    ("Konditsioner Samsung", "Texnik"),
    ("Mikroskop Olympus", "Texnik"),
    ("Laboratoriya stoli", "Mebel"),
    ("Server Dell PowerEdge", "Texnik"),
    ('Monitor LG 27"', "Texnik"),
    ("Skaner Epson", "Texnik"),
]
VEHICLE_DATA = [
    ("Chevrolet", "Lacetti", "01A123BA"),
    ("Isuzu", "NQR", "01B456CA"),
    ("Chevrolet", "Damas", "01C789DA"),
    ("Hyundai", "County", "01D012EA"),
    ("Chevrolet", "Cobalt", "01E345FA"),
    ("GAZ", "3302", "01F678GA"),
]


class Command(BaseCommand):
    help = "Seed infrastructure data"

    def handle(self, *args, **options):
        if DormBuilding.objects.exists():
            self.stdout.write("Infrastructure data already exists, skipping.")
            return

        # Buildings & Rooms
        for name in BUILDING_NAMES:
            building = DormBuilding.objects.create(
                name=name,
                address=f"Universitet shaharchasi, {name}",
                floors=random.randint(3, 5),
                total_rooms=random.randint(40, 80),
            )
            for floor in range(1, building.floors + 1):
                for room_num in range(1, random.randint(8, 16)):
                    cap = random.choice([2, 3, 4])
                    occ = random.randint(0, cap)
                    status = "full" if occ == cap else ("partial" if occ > 0 else "available")
                    DormRoom.objects.create(
                        building=building,
                        number=floor * 100 + room_num,
                        floor=floor,
                        capacity=cap,
                        occupied=occ,
                        status=status,
                    )

        # Equipment
        equipment = []
        for i in range(30):
            name, cat = random.choice(EQUIPMENT_NAMES)
            equipment.append(
                Equipment(
                    name=name,
                    inventory_number=f"INV-{2020 + i:04d}-{random.randint(100, 999)}",
                    category=cat.lower() if cat == "Mebel" else "technical",
                    location=f"{random.randint(1, 5)}-bino, {random.randint(100, 500)}-xona",
                    responsible_person=random.choice(["Karimov A.", "Rahimova S.", "Toshmatov B."]),
                    purchase_date=date.today() - timedelta(days=random.randint(30, 1500)),
                    cost=random.randint(500_000, 50_000_000),
                    status=random.choice(["working", "working", "working", "repair", "storage"]),
                    last_maintenance_date=date.today() - timedelta(days=random.randint(10, 180))
                    if random.random() > 0.4
                    else None,
                )
            )
        Equipment.objects.bulk_create(equipment)

        # Vehicles
        vehicles = []
        for brand, model, plate in VEHICLE_DATA:
            vehicles.append(
                Vehicle(
                    brand=brand,
                    model=model,
                    plate_number=plate,
                    year=random.randint(2015, 2024),
                    driver_name=random.choice(
                        ["Toshmatov B.", "Karimov J.", "Rahimov S.", "Xolmatov A."]
                    ),
                    route=random.choice(["Metro - Universitet", "Shahar markazi - Kampus", ""]),
                    status=random.choice(["available", "in_use", "repair"]),
                    mileage=random.randint(10000, 200000),
                    last_service_date=date.today() - timedelta(days=random.randint(10, 90)),
                )
            )
        Vehicle.objects.bulk_create(vehicles)

        rooms_count = DormRoom.objects.count()
        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(BUILDING_NAMES)} buildings, {rooms_count} rooms, "
                f"{len(equipment)} equipment, {len(vehicles)} vehicles"
            )
        )
