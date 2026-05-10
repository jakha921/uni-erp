"""Finance serializers — Contract, Payment, Scholarship matching frontend interfaces."""

from rest_framework import serializers

from .models import Contract, Payment, PaymentScheduleItem, Scholarship


class PaymentScheduleItemSerializer(serializers.ModelSerializer):
    dueDate = serializers.DateField(source="due_date")
    paidDate = serializers.DateField(source="paid_date", allow_null=True)

    class Meta:
        model = PaymentScheduleItem
        fields = ["id", "dueDate", "amount", "status", "paidDate"]


class ContractListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    studentName = serializers.SerializerMethodField()
    studentIdNumber = serializers.SerializerMethodField()
    contractNumber = serializers.CharField(source="contract_number")
    contractType = serializers.CharField(source="contract_type")
    contractAmount = serializers.DecimalField(
        source="contract_amount", max_digits=14, decimal_places=2
    )
    paidAmount = serializers.DecimalField(source="paid_amount", max_digits=14, decimal_places=2)
    debtAmount = serializers.DecimalField(source="debt_amount", max_digits=14, decimal_places=2)
    status = serializers.CharField()
    facultyName = serializers.SerializerMethodField()
    groupName = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()

    def get_studentName(self, obj: Contract) -> str:
        return obj.student.user.full_name

    def get_studentIdNumber(self, obj: Contract) -> str:
        return obj.student.student_id_number

    def get_facultyName(self, obj: Contract) -> str:
        try:
            return obj.student.group.specialty.department.faculty.name
        except AttributeError:
            return ""

    def get_groupName(self, obj: Contract) -> str:
        return obj.student.group.name if obj.student.group else ""

    def get_level(self, obj: Contract) -> str:
        return obj.student.level if hasattr(obj.student, "level") else ""


class ContractDetailSerializer(ContractListSerializer):
    groupName = serializers.SerializerMethodField()
    level = serializers.SerializerMethodField()
    specialty = serializers.SerializerMethodField()
    contractDate = serializers.DateField(source="contract_date")
    educationYear = serializers.SerializerMethodField()
    paymentSchedule = PaymentScheduleItemSerializer(source="schedule_items", many=True)
    facultyId = serializers.SerializerMethodField()
    createdAt = serializers.SerializerMethodField()

    def get_groupName(self, obj: Contract) -> str:
        return obj.student.group.name

    def get_level(self, obj: Contract) -> str:
        return obj.student.level

    def get_specialty(self, obj: Contract) -> str:
        return obj.student.group.specialty.name

    def get_educationYear(self, obj: Contract) -> str:
        return obj.academic_year.name if obj.academic_year else ""

    def get_facultyId(self, obj: Contract) -> int:
        return obj.student.group.specialty.department.faculty_id

    def get_createdAt(self, obj: Contract) -> str:
        return obj.created_at.isoformat()


class CreatePaymentScheduleItemSerializer(serializers.Serializer):
    dueDate = serializers.DateField()
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)


class CreateContractSerializer(serializers.Serializer):
    studentId = serializers.IntegerField()
    contractType = serializers.ChoiceField(
        choices=["bazoviy", "tabaqalashtirilgan", "grant", "xorijiy"]
    )
    contractAmount = serializers.DecimalField(max_digits=14, decimal_places=2)
    contractDate = serializers.DateField()
    educationYear = serializers.CharField()
    paymentSchedule = CreatePaymentScheduleItemSerializer(many=True, required=False, default=list)

    def create(self, validated_data: dict) -> Contract:
        from apps.core.models import AcademicYear
        from apps.students.models import Student

        student = Student.objects.get(id=validated_data["studentId"])
        year = AcademicYear.objects.filter(name=validated_data["educationYear"]).first()
        count = Contract.objects.count() + 1
        contract = Contract.objects.create(
            contract_number=f"CNT-{validated_data['contractDate'].year}-{count:04d}",
            student=student,
            academic_year=year,
            contract_type=validated_data["contractType"],
            contract_amount=validated_data["contractAmount"],
            debt_amount=validated_data["contractAmount"],
            contract_date=validated_data["contractDate"],
            due_date=validated_data["contractDate"],
        )
        for item in validated_data.get("paymentSchedule", []):
            PaymentScheduleItem.objects.create(
                contract=contract,
                due_date=item["dueDate"],
                amount=item["amount"],
            )
        return contract


class PaymentListSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    contractId = serializers.IntegerField(source="contract_id")
    studentName = serializers.SerializerMethodField()
    facultyName = serializers.SerializerMethodField()
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    paymentDate = serializers.DateTimeField(source="payment_date")
    paymentMethod = serializers.CharField(source="payment_method")
    receiptNumber = serializers.CharField(source="receipt_number")
    note = serializers.CharField()
    createdAt = serializers.SerializerMethodField()

    def get_studentName(self, obj: Payment) -> str:
        return obj.contract.student.user.full_name

    def get_facultyName(self, obj: Payment) -> str:
        return obj.contract.student.group.specialty.department.faculty.name

    def get_createdAt(self, obj: Payment) -> str:
        return obj.created_at.isoformat()


class CreatePaymentSerializer(serializers.Serializer):
    contractId = serializers.IntegerField()
    amount = serializers.DecimalField(max_digits=14, decimal_places=2)
    paymentDate = serializers.DateTimeField()
    paymentMethod = serializers.ChoiceField(choices=["bank", "naqd", "online", "click", "payme"])
    receiptNumber = serializers.CharField(required=False, default="")
    note = serializers.CharField(required=False, default="")

    def validate_contractId(self, value: int) -> int:
        if not Contract.objects.filter(id=value).exists():
            raise serializers.ValidationError("Kontrakt topilmadi.")
        return value

    def create(self, validated_data: dict) -> Payment:
        payment = Payment.objects.create(
            contract_id=validated_data["contractId"],
            amount=validated_data["amount"],
            payment_date=validated_data["paymentDate"],
            payment_method=validated_data["paymentMethod"],
            receipt_number=validated_data.get("receiptNumber", ""),
            note=validated_data.get("note", ""),
        )
        contract = payment.contract
        contract.recalculate()
        contract.save(update_fields=["paid_amount", "debt_amount", "status"])
        return payment


class ScholarshipSerializer(serializers.ModelSerializer):
    studentName = serializers.SerializerMethodField()
    semesterName = serializers.SerializerMethodField()

    class Meta:
        model = Scholarship
        fields = [
            "id",
            "student",
            "studentName",
            "semester",
            "semesterName",
            "type",
            "amount",
            "start_date",
            "end_date",
            "status",
            "basis",
            "created_at",
        ]

    def get_studentName(self, obj: Scholarship) -> str:
        return obj.student.user.full_name

    def get_semesterName(self, obj: Scholarship) -> str:
        return str(obj.semester) if obj.semester else ""


class CreateScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = ["student", "semester", "type", "amount", "start_date", "end_date", "basis"]
