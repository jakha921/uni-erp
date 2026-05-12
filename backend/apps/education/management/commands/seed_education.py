"""Seed subjects, schedules, attendance, grades, exams, curriculums, library, alumni, internships."""

import random
from datetime import date, timedelta

from django.core.management.base import BaseCommand

from apps.accounts.models import User
from apps.core.models import AcademicYear, Department, Faculty, Group, Semester, Specialty
from apps.education.models import (
    Alumni,
    Attendance,
    Book,
    BookLoan,
    Curriculum,
    CurriculumSubject,
    Exam,
    Grade,
    Internship,
    Schedule,
    Subject,
)
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

BOOK_DATA = [
    ("Algoritmlar nazariyasi", "Knuth D.", "978-0201896831", 2002, "textbook"),
    ("Python dasturlash", "Lutz M.", "978-1449355739", 2014, "textbook"),
    ("Django Web Framework", "Django Docs", "", 2023, "reference"),
    ("Ma'lumotlar bazalari asoslari", "Codd E.F.", "978-0201141924", 1990, "textbook"),
    ("Kompyuter tarmoqlari", "Tanenbaum A.", "978-0132126953", 2010, "textbook"),
    ("Operatsion tizimlar", "Silberschatz A.", "978-1118063330", 2012, "textbook"),
    ("Sun'iy intellekt", "Russell S.", "978-0136042594", 2009, "textbook"),
    ("Kiberxavfsizlik asoslari", "Stallings W.", "978-0134444284", 2017, "textbook"),
    ("Veb-dasturlash texnologiyalari", "Flanagan D.", "978-1449393327", 2011, "textbook"),
    ("TypeScript qo'llanma", "Freeman A.", "978-1484270103", 2021, "textbook"),
    ("React dasturlash", "Wieruch R.", "", 2022, "textbook"),
    ("Matematika tahlil", "Zorich V.", "978-3540403869", 2004, "textbook"),
    ("Chiziqli algebra", "Strang G.", "978-0980232776", 2016, "textbook"),
    ("Ehtimollar nazariyasi", "Feller W.", "978-0471257098", 1971, "textbook"),
    ("Iqtisodiyot nazariyasi", "Samuelson P.", "978-0073511290", 2009, "textbook"),
    ("Menejment asoslari", "Mescon M.", "978-0060445096", 1988, "textbook"),
    ("Pedagogika", "Podlasiy I.", "", 2009, "textbook"),
    ("Psixologiya", "Nemov R.", "978-5-691-01701-7", 2008, "textbook"),
    ("Ingliz tili grammatikasi", "Murphy R.", "978-0521189064", 2012, "textbook"),
    ("O'zbek tili va adabiyoti", "Yo'ldoshev B.", "", 2015, "textbook"),
    ("Kompyuter grafikasi", "Hughes J.", "978-0321399526", 2013, "textbook"),
    ("Mobil dasturlash: Android", "Griffiths D.", "978-1491974513", 2017, "textbook"),
    ("iOS dasturlash Swift bilan", "Apple Inc.", "", 2023, "reference"),
    ("Loyihalash metodologiyasi", "PMI", "978-1628255485", 2017, "reference"),
    ("Kurs ishlari qo'llanmasi", "BITU", "", 2022, "reference"),
    ("1001 Bir Kecha", "Anonim", "978-0140449389", 2008, "fiction"),
    ("O'tkan kunlar", "Qodiriy A.", "", 1926, "fiction"),
    ("Sherlok Holmes", "Doyle A.C.", "978-0140439076", 2001, "fiction"),
    ("Kichkina shahzoda", "Saint-Exupery A.", "978-0156012195", 2000, "fiction"),
    ("Ikki eshak", "Hamza", "", 1918, "fiction"),
    ("Davr", "Cho'lpon", "", 1935, "fiction"),
    ("Navoiy", "Oybek", "", 1944, "fiction"),
    ("Texnika va fan jurnali", "BITU", "", 2024, "periodical"),
    ("Informatika yangiliklari", "Redaktsiya", "", 2024, "periodical"),
    ("IT-Dunyo", "IT-Media", "", 2024, "periodical"),
    ("Fizika", "Irodov I.", "978-5-9221-0062-6", 2005, "textbook"),
    ("Kimyo asoslari", "Glinka N.", "", 2006, "textbook"),
    ("Biologiya", "Campbell N.", "978-0134093413", 2016, "textbook"),
    ("Tarix", "Karimov I.", "", 2010, "textbook"),
    ("Falsafa", "Russell B.", "978-0671201586", 1972, "textbook"),
    ("Huquq asoslari", "O'zbekiston", "", 2020, "reference"),
    ("Ekologiya", "Miller G.", "978-1305257177", 2015, "textbook"),
    ("Statistika", "Freedman D.", "978-0393929720", 2007, "textbook"),
    ("Moliya", "Brealey R.", "978-1259253386", 2016, "textbook"),
    ("Buxgalteriya", "Weygandt J.", "978-1119491637", 2018, "textbook"),
    ("Marketing menejment", "Kotler P.", "978-0133856460", 2015, "textbook"),
    ("Strategik boshqaruv", "Thompson A.", "978-0078029295", 2015, "textbook"),
    ("Innovatsion menejment", "Tidd J.", "978-1119379454", 2018, "textbook"),
    ("Biznes aloqalar", "Locker K.", "978-0073403182", 2013, "textbook"),
    ("Tadbirkorlik", "Hisrich R.", "978-0077862534", 2016, "textbook"),
]

ALUMNI_NAMES = [
    "Aliyev Jasur",
    "Karimova Malika",
    "Toshmatov Otabek",
    "Yusupova Dilnoza",
    "Rahimov Sherzod",
    "Nazarova Feruza",
    "Xolmatov Bobur",
    "Sultanova Zulfiya",
    "Hasanov Ulugbek",
    "Mirzayeva Nodira",
    "Qodirov Sanjar",
    "Boltayeva Shahlo",
    "Ergashev Farhod",
    "Tursunova Barno",
    "Abdullayev Mansur",
    "Holiqova Oydin",
    "Sotvoldiyev Eldor",
    "Ruziyeva Gulnora",
    "Nishonov Hamid",
    "Qosimova Sevara",
    "Ismoilov Akbar",
    "Yunusova Muazzam",
    "Xashimov Sardor",
    "Alimova Lola",
    "Jalolov Timur",
    "Xudoyberdiyeva Nargiza",
    "Mamatov Anvar",
    "Tillayeva Umida",
    "Sobirov Behruz",
    "Umarova Sabohat",
    "Qurbonov Diyorbek",
    "Nazarova Hilola",
    "Tojiboyev Islom",
    "Raximova Mohira",
    "Abduraxmonov Nodir",
    "Sultonova Iroda",
    "Haydarov Mirzo",
    "Qorayeva Maftuna",
    "Usmonov Akmal",
    "Baxtiyorova Kamola",
]

COMPANIES = [
    "IT Park Uzbekistan",
    "Epam Systems",
    "Uzum Market",
    "MyTaxi",
    "Humans",
    "Click",
    "Payme",
    "Beeline Uzbekistan",
    "Ucell",
    "MTS Uzbekistan",
    "PwC Uzbekistan",
    "Deloitte Uzbekistan",
    "Ernst & Young",
    "KPMG",
    "Kapitalbank",
    "Hamkorbank",
    "Ipoteka Bank",
    "Agrobank",
    "Samsung Electronics",
    "Huawei Technologies",
    "Google",
    "Microsoft",
    "Uzinfocom",
    "UzAuto Motors",
    "Uzbekistan Airways",
    "Hayot Faoliyati",
]


class Command(BaseCommand):
    help = "Seed education data: subjects, schedules, attendance, grades, exams, curriculum, library, alumni, internships"

    def handle(self, *args, **options):
        rng = random.Random(77)
        departments = list(Department.objects.all())
        if not departments:
            self.stdout.write(self.style.ERROR("Run seed_core first."))
            return

        teachers = list(User.objects.filter(roles__role__in=["oqituvchi", "admin"])[:10])
        if not teachers:
            teachers = list(User.objects.all()[:5])

        # ── Subjects ──────────────────────────────────────────────────────────
        subjects = []
        created_subjects = 0
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

        # ── Semester ───────────────────────────────────────────────────────────
        year = AcademicYear.objects.filter(is_current=True).first()
        semester = Semester.objects.filter(academic_year=year, number=1).first() if year else None
        if not semester:
            self.stdout.write(self.style.WARNING("No current semester — skipping schedules."))
            return

        # ── Schedules ─────────────────────────────────────────────────────────
        groups = list(Group.objects.all()[:20])
        created_schedules = 0
        for group in groups:
            for day in range(1, 6):
                for pair in range(1, 4):
                    if Schedule.objects.filter(
                        group=group, semester=semester, day_of_week=day, pair_number=pair
                    ).exists():
                        continue
                    Schedule.objects.create(
                        group=group,
                        subject=rng.choice(subjects),
                        teacher=rng.choice(teachers),
                        semester=semester,
                        day_of_week=day,
                        pair_number=pair,
                        room=f"{rng.randint(100, 415)}-{rng.choice(['A', 'B'])}",
                        lesson_type=rng.choice(["lecture", "practice", "lab"]),
                    )
                    created_schedules += 1
        self.stdout.write(f"  Schedules: {created_schedules} created")

        # ── Attendance ────────────────────────────────────────────────────────
        schedules = list(Schedule.objects.filter(semester=semester)[:50])
        start_date = semester.start_date
        created_attendance = 0
        for week in range(4):
            for schedule in schedules:
                lesson_date = start_date + timedelta(weeks=week, days=schedule.day_of_week - 1)
                for student in Student.objects.filter(group=schedule.group, is_deleted=False)[:15]:
                    if Attendance.objects.filter(
                        student=student, schedule=schedule, date=lesson_date
                    ).exists():
                        continue
                    Attendance.objects.create(
                        student=student,
                        schedule=schedule,
                        date=lesson_date,
                        status=rng.choices(
                            ["present", "absent", "late", "excused"], weights=[80, 10, 5, 5]
                        )[0],
                    )
                    created_attendance += 1
        self.stdout.write(f"  Attendance: {created_attendance} records created")

        # ── Grades ────────────────────────────────────────────────────────────
        students_all = list(Student.objects.filter(is_deleted=False)[:50])
        created_grades = 0
        for student in students_all:
            for subj in rng.sample(subjects, min(5, len(subjects))):
                for grade_type in ["midterm", "final"]:
                    if Grade.objects.filter(
                        student=student, subject=subj, semester=semester, grade_type=grade_type
                    ).exists():
                        continue
                    Grade.objects.create(
                        student=student,
                        subject=subj,
                        semester=semester,
                        grade_type=grade_type,
                        score=round(rng.uniform(50, 100), 2),
                        max_score=100,
                        graded_by=rng.choice(teachers),
                    )
                    created_grades += 1
        self.stdout.write(f"  Grades: {created_grades} records created")

        # ── Exams (30) ────────────────────────────────────────────────────────
        created_exams = 0
        exam_base = semester.start_date + timedelta(weeks=8)
        for i in range(30):
            group = rng.choice(groups)
            subj = rng.choice(subjects)
            teacher = rng.choice(teachers)
            exam_date = exam_base + timedelta(days=rng.randint(0, 20))
            if Exam.objects.filter(group=group, subject=subj, semester=semester).exists():
                continue
            Exam.objects.create(
                subject=subj,
                group=group,
                teacher=teacher,
                semester=semester,
                exam_type=rng.choice(["midterm", "final", "retake"]),
                date=exam_date,
                start_time=f"{rng.randint(8, 16):02d}:00",
                duration_minutes=rng.choice([90, 120]),
                room=f"{rng.randint(100, 415)}-{rng.choice(['A', 'B'])}",
                max_score=100,
                status=rng.choice(["scheduled", "scheduled", "completed"]),
            )
            created_exams += 1
        self.stdout.write(f"  Exams: {created_exams} created")

        # ── Curriculums (5, 15 subjects each) ────────────────────────────────
        specialties = list(Specialty.objects.all()[:5])
        created_curricula = 0
        for i, specialty in enumerate(specialties):
            curr, created = Curriculum.objects.get_or_create(
                specialty=specialty,
                year=rng.randint(1, 4),
                defaults={"total_credits": rng.randint(120, 180), "description": ""},
            )
            if created:
                created_curricula += 1
                sampled = rng.sample(subjects, min(15, len(subjects)))
                for j, subj in enumerate(sampled):
                    sem_num = (j // 5) + 1
                    CurriculumSubject.objects.get_or_create(
                        curriculum=curr,
                        subject=subj,
                        semester_number=sem_num,
                        defaults={"hours_total": subj.credits * 18, "is_elective": j % 4 == 0},
                    )
        self.stdout.write(f"  Curriculums: {created_curricula} created")

        # ── Books (50) ────────────────────────────────────────────────────────
        created_books = 0
        book_objects = []
        for title, author, isbn, yr, cat in BOOK_DATA:
            copies = rng.randint(3, 10)
            b, created = Book.objects.get_or_create(
                title=title,
                author=author,
                defaults={
                    "isbn": isbn,
                    "year": yr,
                    "category": cat,
                    "copies_total": copies,
                    "copies_available": copies,
                    "location": f"Javon {rng.randint(1, 20)}-{rng.randint(1, 5)}",
                },
            )
            book_objects.append(b)
            if created:
                created_books += 1
        self.stdout.write(f"  Books: {created_books} created ({len(book_objects)} total)")

        # ── BookLoans (30) ────────────────────────────────────────────────────
        created_loans = 0
        students_for_loans = list(Student.objects.filter(is_deleted=False)[:30])
        for i in range(30):
            if not students_for_loans or not book_objects:
                break
            student = rng.choice(students_for_loans)
            book = rng.choice(book_objects)
            if BookLoan.objects.filter(student=student, book=book, status="active").exists():
                continue
            issue_days_ago = rng.randint(1, 30)
            issued = date.today() - timedelta(days=issue_days_ago)
            due = issued + timedelta(days=14)
            is_returned = rng.random() < 0.4
            BookLoan.objects.create(
                book=book,
                student=student,
                due_date=due,
                returned_date=date.today() - timedelta(days=rng.randint(0, 5))
                if is_returned
                else None,
                status="returned"
                if is_returned
                else ("overdue" if due < date.today() else "active"),
            )
            created_loans += 1
        self.stdout.write(f"  BookLoans: {created_loans} created")

        # ── Alumni (40) ───────────────────────────────────────────────────────
        faculties = list(Faculty.objects.all())
        specialties_all = list(Specialty.objects.all())
        created_alumni = 0
        for name in ALUMNI_NAMES:
            _, created = Alumni.objects.get_or_create(
                full_name=name,
                defaults={
                    "graduation_year": rng.randint(2015, 2023),
                    "faculty": rng.choice(faculties) if faculties else None,
                    "specialty": rng.choice(specialties_all) if specialties_all else None,
                    "workplace": rng.choice(COMPANIES),
                    "position": rng.choice(
                        ["Dasturchi", "Menejər", "Tahlilchi", "Dizayner", "DevOps"]
                    ),
                    "phone": f"+998{rng.randint(900000000, 999999999)}",
                    "email": f"{name.lower().replace(' ', '.')}@example.com",
                    "status": rng.choice(
                        ["employed", "employed", "employed", "studying", "unknown"]
                    ),
                },
            )
            if created:
                created_alumni += 1
        self.stdout.write(f"  Alumni: {created_alumni} created")

        # ── Internships (20) ──────────────────────────────────────────────────
        created_internships = 0
        students_for_intern = list(Student.objects.filter(is_deleted=False)[:20])
        for i, student in enumerate(students_for_intern):
            if Internship.objects.filter(student=student).exists():
                continue
            start = date.today() - timedelta(days=rng.randint(10, 60))
            end = start + timedelta(days=rng.randint(21, 60))
            st = rng.choice(["planned", "active", "completed"])
            Internship.objects.create(
                student=student,
                company=rng.choice(COMPANIES),
                supervisor=rng.choice(ALUMNI_NAMES),
                start_date=start,
                end_date=end,
                internship_type=rng.choice(["production", "educational", "pre_graduation"]),
                status=st,
                report_submitted=st == "completed",
                grade=rng.randint(70, 100) if st == "completed" else None,
            )
            created_internships += 1
        self.stdout.write(f"  Internships: {created_internships} created")

        self.stdout.write(self.style.SUCCESS("Education data seeded successfully."))
