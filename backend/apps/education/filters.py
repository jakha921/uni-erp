"""Education filters."""

import django_filters

from .models import Curriculum, Exam


class ExamFilter(django_filters.FilterSet):
    class Meta:
        model = Exam
        fields = ["semester", "group", "subject", "exam_type", "status"]


class CurriculumFilter(django_filters.FilterSet):
    class Meta:
        model = Curriculum
        fields = ["specialty", "year"]
