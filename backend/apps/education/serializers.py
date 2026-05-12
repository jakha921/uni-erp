"""Education serializers — Subject, Schedule, Attendance, Grade, Exam, Curriculum."""

from rest_framework import serializers

from .models import Attendance, Curriculum, CurriculumSubject, Exam, Grade, Schedule, Subject


class SubjectSerializer(serializers.ModelSerializer):
    departmentName = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "name",
            "code",
            "credits",
            "hours_lecture",
            "hours_practice",
            "hours_lab",
            "department",
            "departmentName",
        ]


class ScheduleSerializer(serializers.ModelSerializer):
    subjectName = serializers.CharField(source="subject.name", read_only=True)
    teacherName = serializers.SerializerMethodField()
    groupName = serializers.CharField(source="group.name", read_only=True)
    dayLabel = serializers.SerializerMethodField()

    class Meta:
        model = Schedule
        fields = [
            "id",
            "group",
            "groupName",
            "subject",
            "subjectName",
            "teacher",
            "teacherName",
            "semester",
            "day_of_week",
            "dayLabel",
            "pair_number",
            "room",
            "lesson_type",
        ]

    def get_teacherName(self, obj: Schedule) -> str:
        return obj.teacher.full_name

    def get_dayLabel(self, obj: Schedule) -> str:
        return obj.get_day_of_week_display()


class AttendanceSerializer(serializers.ModelSerializer):
    studentName = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ["id", "student", "studentName", "schedule", "date", "status"]

    def get_studentName(self, obj: Attendance) -> str:
        return obj.student.user.full_name


class BulkAttendanceItemSerializer(serializers.Serializer):
    studentId = serializers.IntegerField()
    status = serializers.ChoiceField(choices=["present", "absent", "late", "excused"])


class BulkAttendanceSerializer(serializers.Serializer):
    scheduleId = serializers.IntegerField()
    date = serializers.DateField()
    records = BulkAttendanceItemSerializer(many=True)

    def create(self, validated_data: dict) -> list:
        results = []
        for rec in validated_data["records"]:
            obj, _ = Attendance.objects.update_or_create(
                student_id=rec["studentId"],
                schedule_id=validated_data["scheduleId"],
                date=validated_data["date"],
                defaults={"status": rec["status"]},
            )
            results.append(obj)
        return results


class GradeSerializer(serializers.ModelSerializer):
    studentId = serializers.IntegerField(source="student.id", read_only=True)
    studentName = serializers.SerializerMethodField()
    subjectName = serializers.CharField(source="subject.name", read_only=True)
    subjectCode = serializers.CharField(source="subject.code", read_only=True)
    semesterNumber = serializers.IntegerField(source="semester.number", read_only=True)
    teacherName = serializers.SerializerMethodField()
    gradeTypeLabel = serializers.SerializerMethodField()

    class Meta:
        model = Grade
        fields = [
            "id",
            "student",
            "studentId",
            "studentName",
            "subject",
            "subjectName",
            "subjectCode",
            "semester",
            "semesterNumber",
            "grade_type",
            "gradeTypeLabel",
            "score",
            "max_score",
            "graded_by",
            "teacherName",
            "updated_at",
        ]

    def get_studentName(self, obj: Grade) -> str:
        return obj.student.user.full_name

    def get_teacherName(self, obj: Grade) -> str:
        return obj.graded_by.full_name

    def get_gradeTypeLabel(self, obj: Grade) -> str:
        return obj.get_grade_type_display()


class BulkGradeItemSerializer(serializers.Serializer):
    studentId = serializers.IntegerField()
    score = serializers.DecimalField(max_digits=5, decimal_places=2)


class BulkGradeSerializer(serializers.Serializer):
    subjectId = serializers.IntegerField()
    semesterId = serializers.IntegerField()
    gradeType = serializers.ChoiceField(choices=["midterm", "final", "coursework"])
    maxScore = serializers.DecimalField(max_digits=5, decimal_places=2, default=100)
    records = BulkGradeItemSerializer(many=True)

    def create(self, validated_data: dict) -> list:
        teacher = self.context["request"].user
        results = []
        for rec in validated_data["records"]:
            obj, _ = Grade.objects.update_or_create(
                student_id=rec["studentId"],
                subject_id=validated_data["subjectId"],
                semester_id=validated_data["semesterId"],
                grade_type=validated_data["gradeType"],
                defaults={
                    "score": rec["score"],
                    "max_score": validated_data["maxScore"],
                    "graded_by": teacher,
                },
            )
            results.append(obj)
        return results


class ExamSerializer(serializers.ModelSerializer):
    subjectName = serializers.CharField(source="subject.name", read_only=True)
    groupName = serializers.CharField(source="group.name", read_only=True)
    teacherName = serializers.SerializerMethodField()
    examTypeLabel = serializers.SerializerMethodField()
    statusLabel = serializers.SerializerMethodField()

    class Meta:
        model = Exam
        fields = [
            "id",
            "subject",
            "subjectName",
            "group",
            "groupName",
            "teacher",
            "teacherName",
            "semester",
            "exam_type",
            "examTypeLabel",
            "date",
            "start_time",
            "duration_minutes",
            "room",
            "max_score",
            "status",
            "statusLabel",
            "notes",
            "created_at",
        ]

    def get_teacherName(self, obj: Exam) -> str:
        return obj.teacher.full_name

    def get_examTypeLabel(self, obj: Exam) -> str:
        return obj.get_exam_type_display()

    def get_statusLabel(self, obj: Exam) -> str:
        return obj.get_status_display()


class ExamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = [
            "subject",
            "group",
            "teacher",
            "semester",
            "exam_type",
            "date",
            "start_time",
            "duration_minutes",
            "room",
            "max_score",
            "status",
            "notes",
        ]


class CurriculumSubjectSerializer(serializers.ModelSerializer):
    subjectName = serializers.CharField(source="subject.name", read_only=True)
    subjectCode = serializers.CharField(source="subject.code", read_only=True)
    credits = serializers.IntegerField(source="subject.credits", read_only=True)

    class Meta:
        model = CurriculumSubject
        fields = [
            "id",
            "subject",
            "subjectName",
            "subjectCode",
            "credits",
            "semester_number",
            "hours_total",
            "is_elective",
        ]


class CurriculumSerializer(serializers.ModelSerializer):
    specialtyName = serializers.CharField(source="specialty.name", read_only=True)
    subjects = CurriculumSubjectSerializer(many=True, read_only=True)

    class Meta:
        model = Curriculum
        fields = [
            "id",
            "specialty",
            "specialtyName",
            "year",
            "total_credits",
            "description",
            "subjects",
            "created_at",
        ]


class CurriculumCreateSerializer(serializers.ModelSerializer):
    subjects = CurriculumSubjectSerializer(many=True, required=False)

    class Meta:
        model = Curriculum
        fields = ["specialty", "year", "total_credits", "description", "subjects"]

    def create(self, validated_data: dict) -> Curriculum:
        subjects_data = validated_data.pop("subjects", [])
        curriculum = Curriculum.objects.create(**validated_data)
        for s in subjects_data:
            CurriculumSubject.objects.create(curriculum=curriculum, **s)
        return curriculum

    def update(self, instance: Curriculum, validated_data: dict) -> Curriculum:
        subjects_data = validated_data.pop("subjects", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if subjects_data is not None:
            instance.subjects.all().delete()
            for s in subjects_data:
                CurriculumSubject.objects.create(curriculum=instance, **s)
        return instance
