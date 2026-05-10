"""Seed Science data: projects, articles, conferences, theses, patents."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.science.models import Article, Conference, Grant, Patent, ResearchProject, Thesis

PROJECT_TITLES = [
    "Sun'iy intellekt asosida talabalar natijalarini bashorat qilish",
    "Qishloq xo'jaligida IoT texnologiyalari",
    "O'zbek tilini qayta ishlash uchun NLP modeli",
    "Yangilanuvchi energiya manbalari samaradorligini oshirish",
    "Raqamli iqtisodiyotda blockchain texnologiyalari",
]

ARTICLE_TITLES = [
    "Machine learning in education: systematic review",
    "IoT-based smart irrigation system",
    "Natural language processing for Uzbek language",
    "Renewable energy optimization using AI",
    "Blockchain applications in digital economy",
    "Deep learning for medical image analysis",
    "Smart city infrastructure development",
    "Cybersecurity challenges in higher education",
]

JOURNALS = [
    "IEEE Access",
    "Springer Nature",
    "Elsevier",
    "O'zbekiston Fanlar akademiyasi axborotnomasi",
    "MDPI Sensors",
    "ACM Computing Surveys",
]

CONF_NAMES = [
    "Raqamli transformatsiya va innovatsiyalar",
    "Zamonaviy ta'lim texnologiyalari",
    "Ilmiy-amaliy konferensiya: Fan va texnologiya",
    "International Conference on AI and IoT",
    "Central Asian Science Forum 2026",
]


class Command(BaseCommand):
    help = "Seed science data"

    def handle(self, *args, **options):
        if ResearchProject.objects.exists():
            self.stdout.write("Science data already exists, skipping.")
            return

        users = list(User.objects.all()[:30])
        if not users:
            return

        admin = User.objects.filter(is_staff=True).first() or users[0]

        # Projects
        projects = []
        depts = ["Kompyuter injiniringi", "Iqtisodiyot", "Pedagogika", "Fizika", "Biologiya"]
        for title in PROJECT_TITLES:
            start = date.today() - timedelta(days=random.randint(30, 365))
            projects.append(
                ResearchProject(
                    title=title,
                    leader=random.choice(users[:10]),
                    department=random.choice(depts),
                    team_size=random.randint(2, 8),
                    fund_amount=random.randint(10, 200) * 1_000_000,
                    start_date=start,
                    end_date=start + timedelta(days=random.randint(180, 730)),
                    status=random.choice(["active", "completed"]),
                    progress=random.randint(10, 100),
                    description=f"{title} - loyiha tavsifi",
                    created_by=admin,
                )
            )
        ResearchProject.objects.bulk_create(projects)

        # Articles
        articles = []
        for title in ARTICLE_TITLES:
            articles.append(
                Article(
                    title=title,
                    authors=f"{random.choice(users[:10]).get_full_name()}, et al.",
                    journal=random.choice(JOURNALS),
                    year=random.choice([2024, 2025, 2026]),
                    type=random.choice(["scopus", "wos", "vak", "local"]),
                    doi=f"10.1234/test.{random.randint(1000, 9999)}"
                    if random.random() > 0.3
                    else "",
                    citations=random.randint(0, 25),
                    created_by=admin,
                )
            )
        Article.objects.bulk_create(articles)

        # Grants
        grants = []
        for i in range(4):
            start = date.today() - timedelta(days=random.randint(0, 300))
            grants.append(
                Grant(
                    project_name=f"Grant loyiha #{i + 1}: {random.choice(PROJECT_TITLES)[:50]}",
                    sponsor=random.choice(
                        [
                            "Innovatsion rivojlanish vazirligi",
                            "UNDP",
                            "World Bank",
                            "KOICA",
                        ]
                    ),
                    amount=random.randint(50, 500) * 1_000_000,
                    status=random.choice(["active", "completed", "pending"]),
                    start_date=start,
                    end_date=start + timedelta(days=random.randint(365, 730)),
                    created_by=admin,
                )
            )
        Grant.objects.bulk_create(grants)

        # Conferences
        confs = []
        for name in CONF_NAMES:
            d = date.today() + timedelta(days=random.randint(-60, 120))
            status = "completed" if d < date.today() else "upcoming"
            confs.append(
                Conference(
                    name=name,
                    date=d,
                    end_date=d + timedelta(days=random.randint(1, 3)),
                    location=random.choice(["Toshkent", "Samarqand", "Buxoro", "Online"]),
                    type=random.choice(["international", "national", "university"]),
                    participant_count=random.randint(30, 300),
                    status=status,
                    description=f"{name} - konferensiya tavsifi",
                    created_by=admin,
                )
            )
        Conference.objects.bulk_create(confs)

        # Theses
        theses = []
        students = list(User.objects.all()[20:40])
        supervisors = list(User.objects.all()[:10])
        if students and supervisors:
            for student in students[:10]:
                theses.append(
                    Thesis(
                        title=f"Bitiruv malakaviy ish: {random.choice(PROJECT_TITLES)[:60]}",
                        student=student,
                        supervisor=random.choice(supervisors),
                        department=random.choice(depts),
                        stage=random.choice(
                            [
                                "topic_approved",
                                "in_progress",
                                "review",
                                "defense",
                                "completed",
                            ]
                        ),
                        type=random.choice(["bakalavr", "magistr"]),
                        grade=random.randint(60, 100) if random.random() > 0.5 else None,
                        defense_date=date.today() + timedelta(days=random.randint(-30, 60))
                        if random.random() > 0.4
                        else None,
                        created_by=admin,
                    )
                )
            Thesis.objects.bulk_create(theses)

        # Patents
        patents = []
        for i in range(5):
            filed = date.today() - timedelta(days=random.randint(30, 500))
            patents.append(
                Patent(
                    title=f"Patent: {random.choice(ARTICLE_TITLES)[:60]}",
                    inventors=f"{random.choice(users[:5]).get_full_name()}, "
                    f"{random.choice(users[5:10]).get_full_name()}",
                    application_date=filed,
                    grant_date=filed + timedelta(days=random.randint(90, 365))
                    if random.random() > 0.5
                    else None,
                    patent_number=f"UZ-{random.randint(10000, 99999)}"
                    if random.random() > 0.4
                    else "",
                    status=random.choice(["filed", "under_review", "granted", "rejected"]),
                    category=random.choice(
                        ["Dasturiy ta'minot", "Qurilma", "Usul", "Biotexnologiya"]
                    ),
                    created_by=admin,
                )
            )
        Patent.objects.bulk_create(patents)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(projects)} projects, {len(articles)} articles, "
                f"{len(grants)} grants, {len(confs)} conferences, "
                f"{len(theses)} theses, {len(patents)} patents"
            )
        )
