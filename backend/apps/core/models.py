"""Core reference models — Branch, Faculty, Department, Specialty, Group, AcademicYear, Semester."""

from django.db import models


class BaseModel(models.Model):
    """Abstract base with audit fields for all models."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )
    updated_by = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    class Meta:
        abstract = True


class Branch(BaseModel):
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, unique=True, verbose_name="Kodi")
    address = models.TextField(blank=True, verbose_name="Manzil")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Telefon")
    is_active = models.BooleanField(default=True, verbose_name="Faol")

    class Meta:
        verbose_name = "Filial"
        verbose_name_plural = "Filiallar"

    def __str__(self) -> str:
        return self.name


class Faculty(BaseModel):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="faculties")
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, verbose_name="Kodi")
    dean = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="dean_faculties",
        verbose_name="Dekan",
    )

    class Meta:
        verbose_name = "Fakultet"
        verbose_name_plural = "Fakultetlar"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Department(BaseModel):
    faculty = models.ForeignKey(Faculty, on_delete=models.CASCADE, related_name="departments")
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, verbose_name="Kodi")
    head = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="head_departments",
        verbose_name="Mudiri",
    )

    class Meta:
        verbose_name = "Kafedra"
        verbose_name_plural = "Kafedralar"
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class Specialty(BaseModel):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name="specialties")
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, verbose_name="Kodi")
    level = models.CharField(
        max_length=20,
        choices=[("bakalavr", "Bakalavr"), ("magistr", "Magistr")],
        verbose_name="Daraja",
    )

    class Meta:
        verbose_name = "Mutaxassislik"
        verbose_name_plural = "Mutaxassisliklar"

    def __str__(self) -> str:
        return self.name


class AcademicYear(BaseModel):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE, related_name="academic_years")
    name = models.CharField(max_length=20, verbose_name="Nomi")
    start_date = models.DateField(verbose_name="Boshlanish sanasi")
    end_date = models.DateField(verbose_name="Tugash sanasi")
    is_current = models.BooleanField(default=False, verbose_name="Joriy yil")

    class Meta:
        verbose_name = "O'quv yili"
        verbose_name_plural = "O'quv yillari"

    def __str__(self) -> str:
        return self.name


class Semester(BaseModel):
    academic_year = models.ForeignKey(
        AcademicYear, on_delete=models.CASCADE, related_name="semesters"
    )
    number = models.PositiveSmallIntegerField(verbose_name="Raqami")
    start_date = models.DateField(verbose_name="Boshlanish sanasi")
    end_date = models.DateField(verbose_name="Tugash sanasi")

    class Meta:
        verbose_name = "Semestr"
        verbose_name_plural = "Semestrlar"

    def __str__(self) -> str:
        return f"{self.academic_year} — {self.number}-semestr"


class Group(BaseModel):
    name = models.CharField(max_length=20, verbose_name="Nomi")
    specialty = models.ForeignKey(Specialty, on_delete=models.CASCADE, related_name="groups")
    course = models.PositiveSmallIntegerField(verbose_name="Kurs")
    education_form = models.CharField(
        max_length=20,
        choices=[
            ("kunduzgi", "Kunduzgi"),
            ("sirtqi", "Sirtqi"),
            ("kechki", "Kechki"),
        ],
        verbose_name="Ta'lim shakli",
    )
    max_students = models.PositiveSmallIntegerField(default=30, verbose_name="Maks. talabalar")
    curator = models.ForeignKey(
        "accounts.User",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="curator_groups",
        verbose_name="Kurator",
    )

    class Meta:
        verbose_name = "Guruh"
        verbose_name_plural = "Guruhlar"

    def __str__(self) -> str:
        return self.name
