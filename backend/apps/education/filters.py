"""Education filters."""

import django_filters

from .models import Exam


class ExamFilter(django_filters.FilterSet):
    class Meta:
        model = Exam
        fields = ["semester", "group", "subject", "exam_type", "status"]
