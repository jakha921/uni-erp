"""Student filters."""

import django_filters

from .models import Student


class StudentFilter(django_filters.FilterSet):
    faculty_id = django_filters.NumberFilter(field_name="group__specialty__department__faculty__id")
    department_id = django_filters.NumberFilter(field_name="group__specialty__department__id")
    group_id = django_filters.NumberFilter(field_name="group__id")
    course = django_filters.NumberFilter()
    status = django_filters.ChoiceFilter(choices=Student.STATUS_CHOICES)
    education_form = django_filters.ChoiceFilter(choices=Student.EDUCATION_FORM_CHOICES)
    payment_form = django_filters.ChoiceFilter(choices=Student.PAYMENT_FORM_CHOICES)

    class Meta:
        model = Student
        fields = [
            "faculty_id",
            "department_id",
            "group_id",
            "course",
            "status",
            "education_form",
            "payment_form",
        ]
