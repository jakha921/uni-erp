"""Education filters."""

import django_filters

from .models import Alumni, Curriculum, Exam, Internship


class ExamFilter(django_filters.FilterSet):
    class Meta:
        model = Exam
        fields = ["semester", "group", "subject", "exam_type", "status"]


class CurriculumFilter(django_filters.FilterSet):
    class Meta:
        model = Curriculum
        fields = ["specialty", "year"]


class AlumniFilter(django_filters.FilterSet):
    class Meta:
        model = Alumni
        fields = ["graduation_year", "faculty", "specialty", "status"]


class InternshipFilter(django_filters.FilterSet):
    class Meta:
        model = Internship
        fields = ["status", "internship_type", "student"]
