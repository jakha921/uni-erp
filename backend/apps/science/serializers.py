from rest_framework import serializers

from .models import Article, Conference, Grant, Patent, ResearchProject, Thesis


class ResearchProjectSerializer(serializers.ModelSerializer):
    leaderName = serializers.CharField(source="leader.get_full_name", read_only=True, default="")
    fundAmount = serializers.DecimalField(
        source="fund_amount", max_digits=15, decimal_places=2, read_only=True
    )
    startDate = serializers.DateField(source="start_date", read_only=True)
    endDate = serializers.DateField(source="end_date", read_only=True)
    teamSize = serializers.IntegerField(source="team_size", read_only=True)

    class Meta:
        model = ResearchProject
        fields = [
            "id",
            "title",
            "leader",
            "leaderName",
            "department",
            "teamSize",
            "fundAmount",
            "startDate",
            "endDate",
            "status",
            "progress",
            "description",
            "created_at",
        ]


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "authors",
            "journal",
            "year",
            "type",
            "doi",
            "citations",
        ]


class GrantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grant
        fields = [
            "id",
            "project_name",
            "sponsor",
            "amount",
            "status",
            "start_date",
            "end_date",
        ]


class ConferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conference
        fields = [
            "id",
            "name",
            "date",
            "end_date",
            "location",
            "type",
            "participant_count",
            "status",
            "description",
        ]


class ThesisSerializer(serializers.ModelSerializer):
    studentName = serializers.CharField(source="student.get_full_name", read_only=True, default="")
    supervisorName = serializers.CharField(
        source="supervisor.get_full_name", read_only=True, default=""
    )

    class Meta:
        model = Thesis
        fields = [
            "id",
            "title",
            "student",
            "studentName",
            "supervisor",
            "supervisorName",
            "department",
            "stage",
            "grade",
            "defense_date",
            "type",
            "created_at",
        ]


class PatentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patent
        fields = [
            "id",
            "title",
            "inventors",
            "application_date",
            "grant_date",
            "patent_number",
            "status",
            "category",
        ]
