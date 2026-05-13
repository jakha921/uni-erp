"""Education models — Subject, Schedule, Attendance, Grade, Exam, Curriculum, Library, Alumni, Internship."""

from django.db import models
from django.utils import timezone


class Subject(models.Model):
    name = models.CharField(max_length=200, verbose_name="Nomi")
    code = models.CharField(max_length=20, unique=True, verbose_name="Kodi")
    hemis_id = models.IntegerField(null=True, blank=True, db_index=True, verbose_name="HEMIS ID")
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


class Book(models.Model):
    """Kutubxona kitob."""

    CATEGORY_CHOICES = [
        ("textbook", "Darslik"),
        ("reference", "Ma'lumotnoma"),
        ("fiction", "Badiiy"),
        ("periodical", "Davriy nashr"),
        ("other", "Boshqa"),
    ]

    title = models.CharField(max_length=300)
    author = models.CharField(max_length=200)
    isbn = models.CharField(max_length=20, blank=True)
    year = models.PositiveSmallIntegerField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="textbook")
    copies_total = models.PositiveSmallIntegerField(default=1)
    copies_available = models.PositiveSmallIntegerField(default=1)
    location = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return f"{self.title} — {self.author}"


class BookLoan(models.Model):
    """Kitob berish/qaytarish."""

    STATUS_CHOICES = [
        ("active", "Berilgan"),
        ("returned", "Qaytarilgan"),
        ("overdue", "Muddati o'tgan"),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="loans")
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="book_loans"
    )
    issued_date = models.DateField(auto_now_add=True)
    due_date = models.DateField()
    returned_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-issued_date"]

    def __str__(self) -> str:
        return f"{self.book.title} — {self.student} — {self.status}"

    def return_book(self) -> None:
        self.returned_date = timezone.now().date()
        self.status = "returned"
        self.save(update_fields=["returned_date", "status"])
        self.book.copies_available = models.F("copies_available") + 1
        self.book.save(update_fields=["copies_available"])


class BookQueueEntry(models.Model):
    """Kutubxona navbati — kitob mavjud bo'lmaganda navbatga yoziladi."""

    STATUS_CHOICES = [
        ("waiting", "Kutmoqda"),
        ("notified", "Xabardor qilindi"),
        ("cancelled", "Bekor qilindi"),
    ]

    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="queue_entries")
    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="book_queue"
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="waiting")
    added_at = models.DateTimeField(auto_now_add=True)
    notified_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["added_at"]
        unique_together = [("book", "student", "status")]

    def __str__(self) -> str:
        return f"{self.student} — {self.book.title} ({self.status})"


class Alumni(models.Model):
    """Bitiruvchi."""

    STATUS_CHOICES = [
        ("employed", "Ishlamoqda"),
        ("studying", "O'qimoqda"),
        ("unemployed", "Ishlamayapti"),
        ("unknown", "Noma'lum"),
    ]

    full_name = models.CharField(max_length=200)
    graduation_year = models.PositiveSmallIntegerField()
    faculty = models.ForeignKey(
        "core.Faculty", on_delete=models.SET_NULL, null=True, related_name="alumni"
    )
    specialty = models.ForeignKey(
        "core.Specialty", on_delete=models.SET_NULL, null=True, related_name="alumni"
    )
    workplace = models.CharField(max_length=300, blank=True)
    position = models.CharField(max_length=200, blank=True)
    phone = models.CharField(max_length=20, blank=True)
    email = models.EmailField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="unknown")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-graduation_year", "full_name"]
        verbose_name_plural = "alumni"

    def __str__(self) -> str:
        return f"{self.full_name} ({self.graduation_year})"


class Internship(models.Model):
    """Amaliyot."""

    TYPE_CHOICES = [
        ("production", "Ishlab chiqarish"),
        ("educational", "O'quv"),
        ("pre_graduation", "Bitiruvchi"),
    ]
    STATUS_CHOICES = [
        ("planned", "Rejalashtirilgan"),
        ("active", "Jarayonda"),
        ("completed", "Yakunlangan"),
        ("cancelled", "Bekor qilingan"),
    ]

    student = models.ForeignKey(
        "students.Student", on_delete=models.CASCADE, related_name="internships"
    )
    company = models.CharField(max_length=300)
    supervisor = models.CharField(max_length=200, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    internship_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="production")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="planned")
    report_submitted = models.BooleanField(default=False)
    grade = models.PositiveSmallIntegerField(null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-start_date"]

    def __str__(self) -> str:
        return f"{self.student} — {self.company} ({self.start_date})"
