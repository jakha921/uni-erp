"""Payment callback endpoints for Payme and Click."""

import logging
from decimal import Decimal

from django.utils import timezone
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Contract, Payment
from .payment_providers import (
    generate_click_link,
    generate_payme_link,
    verify_click_signature,
    verify_payme_signature,
)

logger = logging.getLogger(__name__)


class PaymeCallbackView(APIView):
    """Handle Payme JSON-RPC callbacks."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        auth = request.headers.get("Authorization", "")
        data = request.data
        method = data.get("method", "")
        params = data.get("params", {})
        rpc_id = data.get("id")

        if not verify_payme_signature(data, auth):
            return Response(
                {
                    "jsonrpc": "2.0",
                    "id": rpc_id,
                    "error": {"code": -32504, "message": "Unauthorized"},
                }
            )

        if method == "CheckPerformTransaction":
            return self._check_perform(params, rpc_id)
        elif method == "CreateTransaction":
            return self._create_transaction(params, rpc_id)
        elif method == "PerformTransaction":
            return self._perform_transaction(params, rpc_id)
        elif method == "CancelTransaction":
            return self._cancel_transaction(params, rpc_id)
        elif method == "CheckTransaction":
            return self._check_transaction(params, rpc_id)

        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "error": {"code": -32601, "message": "Method not found"},
            }
        )

    def _check_perform(self, params, rpc_id):
        order_id = params.get("account", {}).get("order_id")
        amount = params.get("amount", 0)

        try:
            contract = Contract.objects.get(id=order_id, is_deleted=False)
        except Contract.DoesNotExist:
            return Response(
                {
                    "jsonrpc": "2.0",
                    "id": rpc_id,
                    "error": {"code": -31050, "message": "Contract not found"},
                }
            )

        debt_tiyin = int(contract.debt_amount * 100)
        if amount > debt_tiyin:
            return Response(
                {
                    "jsonrpc": "2.0",
                    "id": rpc_id,
                    "error": {"code": -31001, "message": "Amount exceeds debt"},
                }
            )

        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {"allow": True},
            }
        )

    def _create_transaction(self, params, rpc_id):
        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "create_time": int(timezone.now().timestamp() * 1000),
                    "transaction": str(params.get("id", "")),
                    "state": 1,
                },
            }
        )

    def _perform_transaction(self, params, rpc_id):
        order_id = params.get("account", {}).get("order_id")
        amount_tiyin = params.get("amount", 0)

        try:
            contract = Contract.objects.get(id=order_id, is_deleted=False)
            amount = Decimal(amount_tiyin) / 100

            Payment.objects.create(
                contract=contract,
                amount=amount,
                payment_method="payme",
                payment_date=timezone.now(),
                note=f"Payme to'lov #{params.get('id', '')}",
            )
            contract.recalculate()
            contract.save()
            logger.info("Payme payment: contract=%s, amount=%s", order_id, amount)

        except Contract.DoesNotExist:
            return Response(
                {
                    "jsonrpc": "2.0",
                    "id": rpc_id,
                    "error": {"code": -31050, "message": "Contract not found"},
                }
            )

        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "perform_time": int(timezone.now().timestamp() * 1000),
                    "transaction": str(params.get("id", "")),
                    "state": 2,
                },
            }
        )

    def _cancel_transaction(self, params, rpc_id):
        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "cancel_time": int(timezone.now().timestamp() * 1000),
                    "transaction": str(params.get("id", "")),
                    "state": -1,
                },
            }
        )

    def _check_transaction(self, params, rpc_id):
        return Response(
            {
                "jsonrpc": "2.0",
                "id": rpc_id,
                "result": {
                    "create_time": 0,
                    "perform_time": 0,
                    "cancel_time": 0,
                    "transaction": str(params.get("id", "")),
                    "state": 2,
                    "reason": None,
                },
            }
        )


class ClickCallbackView(APIView):
    """Handle Click callback requests."""

    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        data = request.data
        action = int(data.get("action", 0))

        if not verify_click_signature(data):
            return Response(
                {
                    "error": -1,
                    "error_note": "Invalid signature",
                }
            )

        if action == 0:
            return self._prepare(data)
        elif action == 1:
            return self._complete(data)

        return Response({"error": -3, "error_note": "Action not found"})

    def _prepare(self, data):
        order_id = data.get("merchant_trans_id")
        amount = Decimal(str(data.get("amount", 0)))

        try:
            contract = Contract.objects.get(id=order_id, is_deleted=False)
        except Contract.DoesNotExist:
            return Response({"error": -5, "error_note": "Contract not found"})

        if amount > contract.debt_amount:
            return Response({"error": -2, "error_note": "Amount exceeds debt"})

        return Response(
            {
                "click_trans_id": data.get("click_trans_id"),
                "merchant_trans_id": order_id,
                "merchant_prepare_id": order_id,
                "error": 0,
                "error_note": "Success",
            }
        )

    def _complete(self, data):
        order_id = data.get("merchant_trans_id")
        amount = Decimal(str(data.get("amount", 0)))
        error = int(data.get("error", 0))

        if error < 0:
            return Response(
                {
                    "click_trans_id": data.get("click_trans_id"),
                    "merchant_trans_id": order_id,
                    "error": -9,
                    "error_note": "Transaction cancelled",
                }
            )

        try:
            contract = Contract.objects.get(id=order_id, is_deleted=False)
            Payment.objects.create(
                contract=contract,
                amount=amount,
                payment_method="click",
                payment_date=timezone.now(),
                note=f"Click to'lov #{data.get('click_trans_id', '')}",
            )
            contract.recalculate()
            contract.save()
            logger.info("Click payment: contract=%s, amount=%s", order_id, amount)

        except Contract.DoesNotExist:
            return Response({"error": -5, "error_note": "Contract not found"})

        return Response(
            {
                "click_trans_id": data.get("click_trans_id"),
                "merchant_trans_id": order_id,
                "merchant_confirm_id": order_id,
                "error": 0,
                "error_note": "Success",
            }
        )


class PaymentLinkView(APIView):
    """Generate payment links for a contract."""

    permission_classes = [IsAuthenticated]

    def get(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id, is_deleted=False)
        except Contract.DoesNotExist:
            return Response({"detail": "Contract not found"}, status=404)

        return Response(
            {
                "contract_id": contract.id,
                "debt_amount": str(contract.debt_amount),
                "payme_link": generate_payme_link(str(contract.id), contract.debt_amount),
                "click_link": generate_click_link(str(contract.id), contract.debt_amount),
            }
        )
