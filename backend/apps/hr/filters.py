"""HR filters."""

import django_filters

from .models import Employee, HrOrder, Leave


class EmployeeFilter(django_filters.FilterSet):
    department_id = django_filters.NumberFilter(field_name="department__id")
    faculty_id = django_filters.NumberFilter(field_name="department__faculty__id")
    status = django_filters.ChoiceFilter(choices=Employee.STATUS_CHOICES)
    employment_form = django_filters.ChoiceFilter(choices=Employee.EMPLOYMENT_FORM_CHOICES)
    academic_degree = django_filters.ChoiceFilter(choices=Employee.DEGREE_CHOICES)
    academic_rank = django_filters.ChoiceFilter(choices=Employee.RANK_CHOICES)

    class Meta:
        model = Employee
        fields = [
            "department_id",
            "faculty_id",
            "status",
            "employment_form",
            "academic_degree",
            "academic_rank",
        ]


class HrOrderFilter(django_filters.FilterSet):
    employee_id = django_filters.NumberFilter(field_name="employee__id")
    type = django_filters.ChoiceFilter(choices=HrOrder.ORDER_TYPES)
    status = django_filters.ChoiceFilter(choices=HrOrder.STATUS_CHOICES)

    class Meta:
        model = HrOrder
        fields = ["employee_id", "type", "status"]


class LeaveFilter(django_filters.FilterSet):
    employee_id = django_filters.NumberFilter(field_name="employee__id")
    type = django_filters.ChoiceFilter(choices=Leave.LEAVE_TYPES)
    status = django_filters.ChoiceFilter(choices=Leave.STATUS_CHOICES)

    class Meta:
        model = Leave
        fields = ["employee_id", "type", "status"]
