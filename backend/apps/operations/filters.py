"""Operations filters."""

import django_filters

from .models import Appeal, News, Notification, Task


class TaskFilter(django_filters.FilterSet):
    """Фильтр для задач."""

    status = django_filters.CharFilter()
    priority = django_filters.CharFilter()
    assignee = django_filters.NumberFilter(field_name="assignee_id")

    class Meta:
        model = Task
        fields = ["status", "priority", "assignee"]


class NotificationFilter(django_filters.FilterSet):
    """Фильтр для уведомлений."""

    type = django_filters.CharFilter()
    is_read = django_filters.BooleanFilter()

    class Meta:
        model = Notification
        fields = ["type", "is_read"]


class AppealFilter(django_filters.FilterSet):
    """Фильтр для обращений."""

    status = django_filters.CharFilter()
    category = django_filters.CharFilter()

    class Meta:
        model = Appeal
        fields = ["status", "category"]


class NewsFilter(django_filters.FilterSet):
    """Фильтр для новостей."""

    category = django_filters.CharFilter()

    class Meta:
        model = News
        fields = ["category"]
