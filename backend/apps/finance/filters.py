"""Finance filters."""

import django_filters
from django.db.models import Q

from .models import Contract, Payment


class ContractFilter(django_filters.FilterSet):
    faculty_id = django_filters.NumberFilter(
        field_name="student__group__specialty__department__faculty__id"
    )
    status = django_filters.ChoiceFilter(choices=Contract.STATUS_CHOICES)
    contract_type = django_filters.ChoiceFilter(choices=Contract.CONTRACT_TYPES)
    education_year = django_filters.CharFilter(field_name="academic_year__name")
    search = django_filters.CharFilter(method="search_filter")

    class Meta:
        model = Contract
        fields = ["faculty_id", "status", "contract_type", "education_year"]

    def search_filter(self, queryset, name, value):
        return queryset.filter(
            Q(contract_number__icontains=value)
            | Q(student__user__first_name__icontains=value)
            | Q(student__user__last_name__icontains=value)
        )


class PaymentFilter(django_filters.FilterSet):
    faculty_id = django_filters.NumberFilter(
        field_name="contract__student__group__specialty__department__faculty__id"
    )
    payment_method = django_filters.ChoiceFilter(choices=Payment.METHODS)
    date_from = django_filters.DateFilter(field_name="payment_date", lookup_expr="gte")
    date_to = django_filters.DateFilter(field_name="payment_date", lookup_expr="lte")

    class Meta:
        model = Payment
        fields = ["faculty_id", "payment_method", "date_from", "date_to"]
