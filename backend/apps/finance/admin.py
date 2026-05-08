"""Finance admin via Unfold."""

from django.contrib import admin
from unfold.admin import ModelAdmin, TabularInline

from .models import Contract, Payment, PaymentScheduleItem, Scholarship


class PaymentScheduleItemInline(TabularInline):
    model = PaymentScheduleItem
    extra = 0
    fields = ["due_date", "amount", "status", "paid_date"]


class PaymentInline(TabularInline):
    model = Payment
    extra = 0
    fields = ["payment_date", "amount", "payment_method", "receipt_number"]
    readonly_fields = ["payment_date", "amount", "payment_method"]


@admin.register(Contract)
class ContractAdmin(ModelAdmin):
    list_display = [
        "contract_number",
        "student",
        "contract_type",
        "contract_amount",
        "paid_amount",
        "debt_amount",
        "status",
    ]
    list_filter = ["status", "contract_type"]
    search_fields = ["contract_number", "student__user__last_name", "student__student_id_number"]
    inlines = [PaymentScheduleItemInline, PaymentInline]


@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = ["contract", "amount", "payment_date", "payment_method", "receipt_number"]
    list_filter = ["payment_method"]
    search_fields = ["contract__contract_number", "receipt_number"]


@admin.register(Scholarship)
class ScholarshipAdmin(ModelAdmin):
    list_display = ["student", "type", "amount", "status", "start_date", "end_date"]
    list_filter = ["type", "status"]
    search_fields = ["student__user__last_name"]
