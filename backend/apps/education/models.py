"""Education models — Subject, Schedule, Attendance, Grade, Exam, Curriculum."""

from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, unique=True, verbose_name="Kodi")
    credits = models.PositiveSmallIntegerField(verbose_name="Kreditlar")
    hours_lecture = models.PositiveSmallIntegerField(default=0)
    hours_practice = models.PositiveSmallIntegerField(default=0)
    hours_lab = models.PositiveSmallIntegerField(default=0)
    department = models.ForeignKey(
        "core.Department", on_delete=models.CASCADE, related_name="subjects"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return f"{self.code} — {self.name}"


class Schedule(models.Model):
    LESSON_TYPE_CHOICES = [
        ("lecture", "Ma'ruza"),
        ("practice", "Amaliy"),
        ("lab", "Laboratoriya"),
    ]
    DAY_CHOICES = [
        (1, "Dushanba"),
        (2, "Seshanba"),
        (3, "Chorshanba"),
        (4, "Payshanba"),
        (5, "Juma"),
        (6, "Shanba"),
    ]

    group = models.ForeignKey("core.Group", on_delete=models.CASCADE, related_name="schedules")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    teacher = models.ForeignKey(
        "accounts.User", on_delete=models.CASCADE, related_name="teaching_schedules"
    )
    semester = models.ForeignKey("core.Semester", on_delete=models.CASCADE)
    day_of_week = models.PositiveSmallIntegerField(choices=DAY_CHOICES)
    pair_number = models.PositiveSmallIntegerField()
    room = models.CharField(max_length=20)
    lesson_type = models.CharField(max_length=20, choices=LESSON_TYPE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ["group", "semester", "day_of_week", "pair_number"]
        ordering = ["day_of_week", "pair_number"]

    def __str__(self) -> str:
        return f"{self.group} — {self.subject} — {self.get_day_of_week_display()} {self.pair_number}-para"


class Attendance(models.Model):
    STATUS_CHOICES = [
        ("present", "Keldi"),
        ("absent", "Kelmadi"),
        ("late", "Kechikdi"),
        ("excused", "Sababli"),
    ]

    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="attendances"
    )
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["student", "schedule", "date"]
        ordering = ["-date"]

    def __str__(self) -> str:
        return f"{self.student} — {self.schedule.subject} — {self.date} — {self.status}"


class Grade(models.Model):
    GRADE_TYPE_CHOICES = [
        ("midterm", "Oraliq"),
        ("final", "Yakuniy"),
        ("coursework", "Kurs ishi"),
    ]

    student = models.ForeignKey("students.Student", on_delete=models.CASCADE, related_name="grades")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester = models.ForeignKey("core.Semester", on_delete=models.CASCADE)
    grade_type = models.CharField(max_length=20, choices=GRADE_TYPE_CHOICES)
    score = models.DecimalField(max_digits=5, decimal_places=2)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    graded_by = models.ForeignKey("accounts.User", on_delete=models.PROTECT, related_name="+")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["student", "subject", "semester", "grade_type"]
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.student} — {self.subject} — {self.grade_type}: {self.score}"


class Exam(models.Model):
    EXAM_TYPE_CHOICES = [
        ("midterm", "Oraliq imtihon"),
        ("final", "Yakuniy imtihon"),
        ("retake", "Qayta topshirish"),
        ("other", "Boshqa"),
    ]
    STATUS_CHOICES = [
        ("scheduled", "Rejalashtirilgan"),
        ("in_progress", "Jarayonda"),
        ("completed", "Yakunlangan"),
        ("cancelled", "Bekor qilingan"),
    ]

    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name="exams")
    group = models.ForeignKey("core.Group", on_delete=models.CASCADE, related_name="exams")
    teacher = models.ForeignKey("accounts.User", on_delete=models.CASCADE, related_name="exams")
    semester = models.ForeignKey("core.Semester", on_delete=models.CASCADE)
    exam_type = models.CharField(max_length=20, choices=EXAM_TYPE_CHOICES, default="final")
    date = models.DateField()
    start_time = models.TimeField()
    duration_minutes = models.PositiveSmallIntegerField(default=90)
    room = models.CharField(max_length=20)
    max_score = models.DecimalField(max_digits=5, decimal_places=2, default=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="scheduled")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["date", "start_time"]

    def __str__(self) -> str:
        return f"{self.subject} — {self.group} — {self.date}"


class Curriculum(models.Model):
    """O'quv reja — specialty va yil bo'yicha."""

    specialty = models.ForeignKey(
        "core.Specialty", on_delete=models.CASCADE, related_name="curriculums"
    )
    year = models.PositiveSmallIntegerField(verbose_name="O'quv yili (1–4)")
    total_credits = models.PositiveSmallIntegerField(default=0)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ["specialty", "year"]
        ordering = ["specialty", "year"]

    def __str__(self) -> str:
        return f"{self.specialty} — {self.year}-kurs"


class CurriculumSubject(models.Model):
    """O'quv reja predmeti — Curriculum + Subject + semester_number."""

    curriculum = models.ForeignKey(Curriculum, on_delete=models.CASCADE, related_name="subjects")
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    semester_number = models.PositiveSmallIntegerField()
    hours_total = models.PositiveSmallIntegerField(default=0)
    is_elective = models.BooleanField(default=False)

    class Meta:
        unique_together = ["curriculum", "subject", "semester_number"]
        ordering = ["semester_number", "subject__name"]

    def __str__(self) -> str:
        return f"{self.curriculum} — {self.subject} — {self.semester_number}-sem"
