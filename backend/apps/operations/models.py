"""Operations models — Task, Notification, Appeal, News."""

from django.db import models

from apps.core.models import BaseModel


class Task(BaseModel):
    """Vazifa — topshiriq modeli."""

    PRIORITY_CHOICES = [
        ("low", "Past"),
        ("medium", "O'rta"),
        ("high", "Yuqori"),
        ("urgent", "Shoshilinch"),
    ]
    STATUS_CHOICES = [
        ("todo", "Rejalashtirilgan"),
        ("in_progress", "Jarayonda"),
        ("review", "Ko'rib chiqilmoqda"),
        ("done", "Bajarildi"),
    ]

    title = models.CharField(max_length=300, verbose_name="Sarlavha")
    description = models.TextField(blank=True, verbose_name="Tavsif")
    assignee = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="tasks",
        verbose_name="Bajaruvchi",
    )
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="medium")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="todo")
    due_date = models.DateField(verbose_name="Muddat")
    tags = models.JSONField(default=list, blank=True, verbose_name="Teglar")

    class Meta:
        verbose_name = "Vazifa"
        verbose_name_plural = "Vazifalar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Notification(BaseModel):
    """Bildirishnoma modeli."""

    TYPE_CHOICES = [
        ("info", "Info"),
        ("warning", "Ogohlantirish"),
        ("success", "Muvaffaqiyat"),
        ("error", "Xatolik"),
        ("system", "Tizim"),
    ]

    user = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="notifications",
    )
    title = models.CharField(max_length=300)
    message = models.TextField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES, default="info")
    is_read = models.BooleanField(default=False)
    link = models.CharField(max_length=500, blank=True)

    class Meta:
        verbose_name = "Bildirishnoma"
        verbose_name_plural = "Bildirishnomalar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Appeal(BaseModel):
    """Murojaat modeli."""

    CATEGORY_CHOICES = [
        ("complaint", "Shikoyat"),
        ("request", "So'rov"),
        ("suggestion", "Taklif"),
        ("question", "Savol"),
    ]
    STATUS_CHOICES = [
        ("new", "Yangi"),
        ("in_progress", "Jarayonda"),
        ("resolved", "Hal qilindi"),
        ("closed", "Yopildi"),
    ]

    title = models.CharField(max_length=300, verbose_name="Sarlavha")
    description = models.TextField(verbose_name="Tavsif")
    category = models.CharField(max_length=15, choices=CATEGORY_CHOICES)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="new")
    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="authored_appeals",
    )
    assignee = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="assigned_appeals",
    )

    class Meta:
        verbose_name = "Murojaat"
        verbose_name_plural = "Murojaatlar"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class AppealComment(BaseModel):
    """Murojaat izohi."""

    appeal = models.ForeignKey(Appeal, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="+",
    )
    content = models.TextField()

    class Meta:
        ordering = ["created_at"]


class News(BaseModel):
    """Yangilik modeli."""

    title = models.CharField(max_length=300, verbose_name="Sarlavha")
    content = models.TextField(verbose_name="Mazmun")
    excerpt = models.CharField(max_length=500, blank=True)
    author = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="news_articles",
    )
    category = models.CharField(max_length=100, blank=True)
    tags = models.JSONField(default=list, blank=True)
    image = models.ImageField(upload_to="news/", blank=True, null=True)
    is_pinned = models.BooleanField(default=False)

    class Meta:
        verbose_name = "Yangilik"
        verbose_name_plural = "Yangiliklar"
        ordering = ["-is_pinned", "-created_at"]

    def __str__(self) -> str:
        return self.title
