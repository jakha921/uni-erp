"""Core filters for Department and Group endpoints."""

import django_filters

from .models import Department, Group


class DepartmentFilter(django_filters.FilterSet):
    faculty_id = django_filters.NumberFilter(field_name="faculty__id")

    class Meta:
        model = Department
        fields = ["faculty_id"]


class GroupFilter(django_filters.FilterSet):
    faculty_id = django_filters.NumberFilter(field_name="specialty__department__faculty__id")
    specialty_id = django_filters.NumberFilter(field_name="specialty__id")
    course = django_filters.NumberFilter()

    class Meta:
        model = Group
        fields = ["faculty_id", "specialty_id", "course"]
