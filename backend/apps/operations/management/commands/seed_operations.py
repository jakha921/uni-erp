"""Seed Operations data: tasks, notifications, appeals, news."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.operations.models import Appeal, News, Notification, Task

TASK_TITLES = [
    "Yakuniy imtihon jadvalini tayyorlash",
    "Kafedra yig'ilishi bayonnomasi",
    "Ilmiy maqola tekshiruvi",
    "Talabalar ro'yxatini yangilash",
    "O'quv rejani tasdiqlash",
    "Kutubxona fondini tekshirish",
    "Sport musobaqasini tashkil qilish",
    "Stipendiya ro'yxatini tayyorlash",
    "Amaliyot shartnomalarini rasmiylashtirish",
    "Fakultet hisobotini tayyorlash",
    "Kadrlar bo'limiga hujjat topshirish",
    "Xalqaro konferensiyaga tayyorgarlik",
    "Talabalar ilmiy to'garagini tashkil qilish",
    "Dars jadvalini optimallashtirish",
    "Yangi o'quv adabiyotlarini buyurtma qilish",
]

NEWS_TITLES = [
    "Universitet yangi binosi qurilishi boshlandi",
    "Xalqaro grant dasturi e'lon qilindi",
    "Talabalar sport festivali bo'lib o'tdi",
    "Yangi laboratoriya jihozlari keltirildi",
    "Professor X xalqaro mukofot sovrindori bo'ldi",
    "Bahorgi imtihon sessiyasi jadvali tasdiqlandi",
    "Universitet reytingi 15 pog'onaga ko'tarildi",
    "Yangi akademik yil uchun qabul e'lon qilindi",
]

APPEAL_TITLES = [
    "Yotoqxona shartlarini yaxshilash",
    "Dars jadvalidagi nomuvofiqlik",
    "Kutubxona ish vaqtini uzaytirish",
    "Sport zalidan foydalanish",
    "Stipendiya to'lovlarini kechikishi",
    "Internet tezligini oshirish",
    "Oshxona sifatini yaxshilash",
    "Laboratoriya jihozlari yetishmovchiligi",
]


class Command(BaseCommand):
    help = "Seed operations data"

    def handle(self, *args, **options):
        if Task.objects.exists():
            self.stdout.write("Operations data already exists, skipping.")
            return

        users = list(User.objects.all()[:20])
        if not users:
            self.stdout.write(self.style.WARNING("No users found. Run seed_core first."))
            return

        admin = User.objects.filter(is_staff=True).first() or users[0]

        # Tasks
        tasks = []
        for title in TASK_TITLES:
            tasks.append(
                Task(
                    title=title,
                    description=f"{title} bo'yicha vazifa",
                    assignee=random.choice(users),
                    priority=random.choice(["low", "medium", "high", "urgent"]),
                    status=random.choice(["todo", "in_progress", "review", "done"]),
                    due_date=date.today() + timedelta(days=random.randint(-5, 30)),
                    created_by=admin,
                )
            )
        Task.objects.bulk_create(tasks)

        # Notifications
        notifications = []
        for user in users[:10]:
            for _ in range(random.randint(2, 5)):
                notifications.append(
                    Notification(
                        user=user,
                        title=random.choice(
                            [
                                "Yangi vazifa",
                                "Muddat yaqinlashmoqda",
                                "Tizim yangilandi",
                                "Yangi xabar",
                                "Hisobot tayyor",
                            ]
                        ),
                        message="Tizimda yangi hodisa ro'y berdi.",
                        type=random.choice(["info", "warning", "success", "system"]),
                        is_read=random.random() > 0.6,
                    )
                )
        Notification.objects.bulk_create(notifications)

        # Appeals
        appeals = []
        for title in APPEAL_TITLES:
            appeals.append(
                Appeal(
                    title=title,
                    description=f"{title} haqida batafsil murojaat matni.",
                    category=random.choice(["complaint", "request", "suggestion", "question"]),
                    status=random.choice(["new", "in_progress", "resolved", "closed"]),
                    author=random.choice(users),
                    assignee=admin if random.random() > 0.3 else None,
                    created_by=admin,
                )
            )
        Appeal.objects.bulk_create(appeals)

        # News
        news = []
        for i, title in enumerate(NEWS_TITLES):
            news.append(
                News(
                    title=title,
                    content=f"{title}. Bu yangilik tafsilotlari bu yerda ko'rsatiladi.",
                    excerpt=title[:100],
                    author=admin,
                    category=random.choice(["ta'lim", "ilm-fan", "sport", "madaniyat", "e'lon"]),
                    is_pinned=i < 2,
                    created_by=admin,
                )
            )
        News.objects.bulk_create(news)

        self.stdout.write(
            self.style.SUCCESS(
                f"Created {len(tasks)} tasks, {len(notifications)} notifications, "
                f"{len(appeals)} appeals, {len(news)} news"
            )
        )
