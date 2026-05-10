import django_filters

from .models import Lead


class LeadFilter(django_filters.FilterSet):
    status = django_filters.CharFilter()
    source = django_filters.CharFilter()
    assignee = django_filters.NumberFilter(field_name="assignee_id")
    date_from = django_filters.DateFilter(field_name="created_at", lookup_expr="gte")
    date_to = django_filters.DateFilter(field_name="created_at", lookup_expr="lte")

    class Meta:
        model = Lead
        fields = ["status", "source", "assignee"]
