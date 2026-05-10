from rest_framework import serializers

from .models import Lead


class LeadListSerializer(serializers.ModelSerializer):
    assigneeName = serializers.CharField(
        source="assignee.get_full_name", read_only=True, default=""
    )

    class Meta:
        model = Lead
        fields = [
            "id",
            "first_name",
            "last_name",
            "phone",
            "email",
            "direction",
            "source",
            "status",
            "assigneeName",
            "score",
            "created_at",
        ]


class LeadDetailSerializer(serializers.ModelSerializer):
    assigneeName = serializers.CharField(
        source="assignee.get_full_name", read_only=True, default=""
    )

    class Meta:
        model = Lead
        fields = "__all__"


class LeadCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = [
            "first_name",
            "last_name",
            "phone",
            "email",
            "direction",
            "source",
            "notes",
            "assignee",
        ]
