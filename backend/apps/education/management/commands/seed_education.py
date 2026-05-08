"""Seed subjects, schedules, attendance, and grades."""

import random
from datetime import timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.core.models import AcademicYear, Department, Group, Semester
from apps.education.models import Attendance, Grade, Schedule, Subject
from apps.students.models import Student

SUBJECTS_DATA = [
    ("Matematika", "MAT101", 4),
    ("Algoritmlar va ma'lumotlar tuzilmalari", "ALG102", 5),
    ("Ma'lumotlar bazalari", "DB103", 4),
    ("Dasturlash tillari", "PL104", 4),
    ("Iqtisodiyot asoslari", "ECO101", 3),
    ("Menejment", "MAN102", 3),
    ("Marketing", "MRK103", 3),
    ("Pedagogika", "PED101", 4),
    ("Psixologiya", "PSY102", 3),
    ("Veb-dasturlash", "WEB201", 4),
    ("Mobil dasturlash", "MOB202", 4),
    ("Tarmoqlar", "NET203", 3),
    ("Operatsion tizimlar", "OS204", 3),
    ("Kompyuter grafikasi", "CG205", 3),
    ("Sun'iy intellekt", "AI301", 4),
    ("Kiberxavfsizlik", "CS302", 4),
    ("Loyihalash metodologiyasi", "PM303", 3),
    ("Ingliz tili", "ENG001", 3),
    ("O'zbek tili", "UZB002", 2),
    ("Jismoniy tarbiya", "PE003", 2),
]


class Command(BaseCommand):
    help = "Seed education data: subjects, schedules, attendance, grades"

    def handle(self, *args, **options):
        rng = random.Random(77)
        departments = list(Department.objects.all())
        if not departments:
            self.stdout.write(self.style.ERROR("Run seed_core first."))
            return

        # Create subjects
        teachers = list(User.objects.filter(roles__role__in=["oqituvchi", "admin"])[:10])
        if not teachers:
            teachers = list(User.objects.all()[:5])

        created_subjects = 0
        subjects = []
        for name, code, credits in SUBJECTS_DATA:
            dept = rng.choice(departments)
            subj, created = Subject.objects.get_or_create(
                code=code,
                defaults={
                    "name": name,
                    "credits": credits,
                    "hours_lecture": credits * 10,
                    "hours_practice": credits * 8,
                    "department": dept,
                },
            )
            subjects.append(subj)
            if created:
                created_subjects += 1

        self.stdout.write(f"  Subjects: {created_subjects} created ({len(subjects)} total)")

        # Create schedules for current semester
        year = AcademicYear.objects.filter(is_current=True).first()
        semester = Semester.objects.filter(academic_year=year, number=1).first() if year else None
        if not semester:
            self.stdout.write(self.style.WARNING("No current semester found — skipping schedules."))
            return

        groups = list(Group.objects.all()[:20])
        created_schedules = 0
        for group in groups:
            for day in range(1, 6):
                for pair in range(1, 4):
                    if Schedule.objects.filter(
                        group=group, semester=semester, day_of_week=day, pair_number=pair
                    ).exists():
                        continue
                    subj = rng.choice(subjects)
                    teacher = rng.choice(teachers) if teachers else None
                    if not teacher:
                        continue
                    Schedule.objects.create(
                        group=group,
                        subject=subj,
                        teacher=teacher,
                        semester=semester,
                        day_of_week=day,
                        pair_number=pair,
                        room=f"{rng.randint(100, 415)}-{rng.choice(['A', 'B'])}",
                        lesson_type=rng.choice(["lecture", "practice", "lab"]),
                    )
                    created_schedules += 1

        self.stdout.write(f"  Schedules: {created_schedules} created")

        # Generate attendance for 4 weeks
        schedules = list(Schedule.objects.filter(semester=semester)[:50])
        start_date = semester.start_date
        created_attendance = 0
        for week in range(4):
            for schedule in schedules:
                lesson_date = start_date + timedelta(weeks=week, days=schedule.day_of_week - 1)
                students = list(Student.objects.filter(group=schedule.group, is_deleted=False)[:15])
                for student in students:
                    if Attendance.objects.filter(
                        student=student, schedule=schedule, date=lesson_date
                    ).exists():
                        continue
                    Attendance.objects.create(
                        student=student,
                        schedule=schedule,
                        date=lesson_date,
                        status=rng.choices(
                            ["present", "absent", "late", "excused"],
                            weights=[80, 10, 5, 5],
                        )[0],
                    )
                    created_attendance += 1

        self.stdout.write(f"  Attendance: {created_attendance} records created")

        # Generate grades
        students_all = list(Student.objects.filter(is_deleted=False)[:50])
        created_grades = 0
        for student in students_all:
            for subj in rng.sample(subjects, min(5, len(subjects))):
                for grade_type in ["midterm", "final"]:
                    if Grade.objects.filter(
                        student=student, subject=subj, semester=semester, grade_type=grade_type
                    ).exists():
                        continue
                    teacher = rng.choice(teachers) if teachers else None
                    if not teacher:
                        continue
                    Grade.objects.create(
                        student=student,
                        subject=subj,
                        semester=semester,
                        grade_type=grade_type,
                        score=round(rng.uniform(50, 100), 2),
                        max_score=100,
                        graded_by=teacher,
                    )
                    created_grades += 1

        self.stdout.write(f"  Grades: {created_grades} records created")
        self.stdout.write(self.style.SUCCESS("Education data seeded successfully."))
