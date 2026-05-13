"""Student models."""

from django.db import models


class Student(models.Model):
    STATUS_CHOICES = [
        ("active", "Faol"),
        ("academic_leave", "Akademik ta'til"),
        ("expelled", "O'chirilgan"),
        ("graduated", "Bitirgan"),
        ("transferred", "Ko'chirilgan"),
    ]
    EDUCATION_FORM_CHOICES = [
        ("kunduzgi", "Kunduzgi"),
        ("sirtqi", "Sirtqi"),
        ("kechki", "Kechki"),
    ]
    PAYMENT_FORM_CHOICES = [
        ("kontrakt", "Kontrakt"),
        ("grant", "Grant"),
    ]
    GENDER_CHOICES = [
        ("male", "Erkak"),
        ("female", "Ayol"),
    ]
    LEVEL_CHOICES = [
        ("bakalavr", "Bakalavr"),
        ("magistr", "Magistr"),
    ]

    user = models.OneToOneField(
        "accounts.User", on_delete=models.CASCADE, related_name="student_profile"
    )
    student_id_number = models.CharField(max_length=20, unique=True, db_index=True)
    hemis_id = models.IntegerField(null=True, blank=True, db_index=True, verbose_name="HEMIS ID")
    group = models.ForeignKey("core.Group", on_delete=models.PROTECT, related_name="students")
    course = models.PositiveSmallIntegerField()
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default="bakalavr")
    education_type = models.CharField(max_length=20, choices=PAYMENT_FORM_CHOICES)
    payment_form = models.CharField(max_length=20, choices=PAYMENT_FORM_CHOICES)
    education_form = models.CharField(
        max_length=20, choices=EDUCATION_FORM_CHOICES, default="kunduzgi"
    )
    enrollment_date = models.DateField()
    graduation_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20, choices=STATUS_CHOICES, default="active", db_index=True
    )
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    passport = models.CharField(max_length=9, blank=True)
    pinfl = models.CharField(max_length=14, blank=True)
    address = models.TextField(blank=True)
    avg_grade = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["group", "status"]),
            models.Index(fields=["student_id_number"]),
        ]
        ordering = ["user__last_name", "user__first_name"]

    def __str__(self) -> str:
        return f"{self.student_id_number} — {self.user.full_name}"


class StudentDocument(models.Model):
    """Талаба ҳужжатлари."""

    CATEGORY_CHOICES = [
        ("passport", "Pasport"),
        ("diploma", "Diplom"),
        ("certificate", "Sertifikat"),
        ("contract", "Kontrakt"),
        ("photo", "Fotosurat"),
        ("other", "Boshqa"),
    ]

    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name="documents")
    name = models.CharField(max_length=200, verbose_name="Nomi")
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="other")
    file = models.FileField(upload_to="student_documents/%Y/%m/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self) -> str:
        return f"{self.student} — {self.name}"
