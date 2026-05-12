from django.core.management.base import BaseCommand

from apps.accounts.models import User, UserRole

DEMO_USERS = [
    {
        "phone": "+998901234567",
        "password": "admin123",
        "first_name": "Admin",
        "last_name": "Adminov",
        "middle_name": "Akramovich",
        "email": "admin@bitu.uz",
        "role": "admin",
        "is_superuser": True,
        "is_staff": True,
    },
    {
        "phone": "+998902345678",
        "password": "demo123",
        "first_name": "Buxgalter",
        "last_name": "Buxgalterov",
        "middle_name": "Buxgalterovich",
        "email": "buxgalter@bitu.uz",
        "role": "buxgalter",
        "is_superuser": False,
        "is_staff": False,
    },
    {
        "phone": "+998903456789",
        "password": "demo123",
        "first_name": "Dekan",
        "last_name": "Dekanov",
        "middle_name": "Dekanovich",
        "email": "dekan@bitu.uz",
        "role": "dekan",
        "is_superuser": False,
        "is_staff": False,
    },
    {
        "phone": "+998904567890",
        "password": "demo123",
        "first_name": "Oqituvchi",
        "last_name": "Oqituvchiev",
        "middle_name": "Oqituvchievich",
        "email": "oqituvchi@bitu.uz",
        "role": "oqituvchi",
        "is_superuser": False,
        "is_staff": False,
    },
    {
        "phone": "+998905678901",
        "password": "demo123",
        "first_name": "Talaba",
        "last_name": "Talabayev",
        "middle_name": "Talabayevich",
        "email": "talaba@bitu.uz",
        "role": "talaba",
        "is_superuser": False,
        "is_staff": False,
    },
]


class Command(BaseCommand):
    help = "Create or update demo users for all 5 roles"

    def handle(self, *args, **options):
        for data in DEMO_USERS:
            role = data.pop("role")
            password = data.pop("password")
            is_superuser = data.pop("is_superuser")
            is_staff = data.pop("is_staff")
            phone = data["phone"]

            user, created = User.objects.get_or_create(phone=phone, defaults=data)
            if not created:
                for field, value in data.items():
                    setattr(user, field, value)

            user.set_password(password)
            user.is_superuser = is_superuser
            user.is_staff = is_staff
            user.save()

            UserRole.objects.update_or_create(user=user, defaults={"role": role})

            action = "Created" if created else "Updated"
            self.stdout.write(self.style.SUCCESS(f"{action} demo user: {phone} ({role})"))
