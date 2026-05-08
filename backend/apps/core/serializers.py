"""Core serializers — read-only reference data."""

from rest_framework import serializers

from .models import AcademicYear, Branch, Department, Faculty, Group, Semester, Specialty


class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = ["id", "name", "code", "address", "phone", "is_active"]


class FacultySerializer(serializers.ModelSerializer):
    branchName = serializers.CharField(source="branch.name", read_only=True)

    class Meta:
        model = Faculty
        fields = ["id", "name", "code", "branchName", "branch"]


class DepartmentSerializer(serializers.ModelSerializer):
    facultyName = serializers.CharField(source="faculty.name", read_only=True)

    class Meta:
        model = Department
        fields = ["id", "name", "code", "faculty", "facultyName"]


class SpecialtySerializer(serializers.ModelSerializer):
    departmentName = serializers.CharField(source="department.name", read_only=True)

    class Meta:
        model = Specialty
        fields = ["id", "name", "code", "level", "department", "departmentName"]


class SemesterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Semester
        fields = ["id", "number", "start_date", "end_date", "academic_year"]


class AcademicYearSerializer(serializers.ModelSerializer):
    semesters = SemesterSerializer(many=True, read_only=True)

    class Meta:
        model = AcademicYear
        fields = ["id", "name", "start_date", "end_date", "is_current", "semesters"]


class GroupSerializer(serializers.ModelSerializer):
    specialtyName = serializers.CharField(source="specialty.name", read_only=True)
    facultyId = serializers.IntegerField(source="specialty.department.faculty_id", read_only=True)
    facultyName = serializers.CharField(source="specialty.department.faculty.name", read_only=True)

    class Meta:
        model = Group
        fields = [
            "id",
            "name",
            "course",
            "education_form",
            "max_students",
            "specialty",
            "specialtyName",
            "facultyId",
            "facultyName",
        ]
