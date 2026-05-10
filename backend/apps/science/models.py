"""Science models — Research projects, Articles, Conferences, Theses, Patents."""

from django.db import models

from apps.core.models import BaseModel


class ResearchProject(BaseModel):
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("completed", "Yakunlangan"),
        ("suspended", "To'xtatilgan"),
    ]

    title = models.CharField(max_length=500, verbose_name="Sarlavha")
    leader = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="research_projects",
    )
    department = models.CharField(max_length=200)
    team_size = models.IntegerField(default=1)
    fund_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    start_date = models.DateField()
    end_date = models.DateField()
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="active")
    progress = models.IntegerField(default=0)
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Ilmiy loyiha"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Article(BaseModel):
    TYPE_CHOICES = [
        ("scopus", "Scopus"),
        ("wos", "Web of Science"),
        ("vak", "VAK"),
        ("local", "Mahalliy"),
    ]

    title = models.CharField(max_length=500)
    authors = models.CharField(max_length=500)
    journal = models.CharField(max_length=300)
    year = models.IntegerField()
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    doi = models.CharField(max_length=100, blank=True)
    citations = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Maqola"
        ordering = ["-year"]

    def __str__(self) -> str:
        return self.title


class Grant(BaseModel):
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("completed", "Yakunlangan"),
        ("pending", "Kutilmoqda"),
    ]

    project_name = models.CharField(max_length=500)
    sponsor = models.CharField(max_length=300)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="pending")
    start_date = models.DateField()
    end_date = models.DateField()

    class Meta:
        verbose_name = "Grant"
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return self.project_name


class Conference(BaseModel):
    TYPE_CHOICES = [
        ("international", "Xalqaro"),
        ("national", "Respublika"),
        ("university", "Universitet"),
    ]
    STATUS_CHOICES = [
        ("upcoming", "Kelgusi"),
        ("active", "Faol"),
        ("completed", "Yakunlangan"),
    ]

    name = models.CharField(max_length=500)
    date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=300)
    type = models.CharField(max_length=15, choices=TYPE_CHOICES)
    participant_count = models.IntegerField(default=0)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="upcoming")
    description = models.TextField(blank=True)

    class Meta:
        verbose_name = "Konferensiya"
        ordering = ["-date"]

    def __str__(self) -> str:
        return self.name


class Thesis(BaseModel):
    TYPE_CHOICES = [
        ("bakalavr", "Bakalavr"),
        ("magistr", "Magistr"),
    ]
    STAGE_CHOICES = [
        ("topic_approved", "Mavzu tasdiqlangan"),
        ("in_progress", "Jarayonda"),
        ("review", "Ko'rib chiqilmoqda"),
        ("defense", "Himoya"),
        ("completed", "Yakunlangan"),
    ]

    title = models.CharField(max_length=500)
    student = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="theses_as_student",
    )
    supervisor = models.ForeignKey(
        "accounts.User",
        on_delete=models.CASCADE,
        related_name="theses_as_supervisor",
    )
    department = models.CharField(max_length=200)
    stage = models.CharField(max_length=20, choices=STAGE_CHOICES, default="topic_approved")
    grade = models.IntegerField(null=True, blank=True)
    defense_date = models.DateField(null=True, blank=True)
    type = models.CharField(max_length=10, choices=TYPE_CHOICES)

    class Meta:
        verbose_name = "Bitiruv malakaviy ish"
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.title


class Patent(BaseModel):
    STATUS_CHOICES = [
        ("filed", "Topshirildi"),
        ("under_review", "Ko'rib chiqilmoqda"),
        ("granted", "Berildi"),
        ("rejected", "Rad etildi"),
    ]

    title = models.CharField(max_length=500)
    inventors = models.CharField(max_length=500)
    application_date = models.DateField()
    grant_date = models.DateField(null=True, blank=True)
    patent_number = models.CharField(max_length=50, blank=True)
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="filed")
    category = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Patent"
        ordering = ["-application_date"]

    def __str__(self) -> str:
        return self.title
