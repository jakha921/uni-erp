"""Seed CRM data: leads for student recruitment."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.crm.models import Lead

FIRST_NAMES = [
    "Sardor",
    "Jamshid",
    "Nodir",
    "Dilshod",
    "Aziz",
    "Shahlo",
    "Madina",
    "Zilola",
    "Durdona",
    "Kamola",
    "Oybek",
    "Farkhod",
    "Murod",
    "Umid",
    "Behruz",
    "Sitora",
    "Robiya",
    "Gulbahor",
    "Nasiba",
    "Laylo",
]
LAST_NAMES = [
    "Karimov",
    "Yusupov",
    "Toshmatov",
    "Alimov",
    "Xolmatov",
    "Raxmatullayev",
    "Abdullayev",
    "Sobirov",
    "Mirzayev",
    "Normatov",
]
DIRECTIONS = [
    "Kompyuter injiniringi",
    "Iqtisodiyot",
    "Menejment",
    "Pedagogika",
    "Filologiya",
    "Matematika",
    "Biologiya",
    "Tarix",
    "Huquqshunoslik",
    "Arxitektura",
]


class Command(BaseCommand):
    help = "Seed CRM leads"

    def handle(self, *args, **options):
        if Lead.objects.exists():
            self.stdout.write("CRM data already exists, skipping.")
            return

        admin = User.objects.filter(is_staff=True).first()
        statuses = [s[0] for s in Lead.STATUS_CHOICES]
        sources = [s[0] for s in Lead.SOURCE_CHOICES]

        leads = []
        for i in range(80):
            first = random.choice(FIRST_NAMES)
            last = random.choice(LAST_NAMES)
            leads.append(
                Lead(
                    first_name=first,
                    last_name=last,
                    phone=f"+99890{random.randint(1000000, 9999999)}",
                    email=f"{first.lower()}.{last.lower()}@gmail.com"
                    if random.random() > 0.3
                    else "",
                    direction=random.choice(DIRECTIONS),
                    source=random.choice(sources),
                    status=random.choice(statuses),
                    assignee=admin,
                    score=random.randint(10, 95),
                    notes=f"Abituriyent {first} {last} haqida ma'lumot"
                    if random.random() > 0.5
                    else "",
                    last_contact_date=date.today() - timedelta(days=random.randint(0, 30))
                    if random.random() > 0.4
                    else None,
                    next_contact_date=date.today() + timedelta(days=random.randint(1, 14))
                    if random.random() > 0.5
                    else None,
                )
            )
        Lead.objects.bulk_create(leads)
        self.stdout.write(self.style.SUCCESS(f"Created {len(leads)} CRM leads"))
