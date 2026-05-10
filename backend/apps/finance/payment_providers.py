"""Payment provider integrations — Payme and Click."""

import base64
import hashlib
import logging
import os
from decimal import Decimal

logger = logging.getLogger(__name__)


# Payme config
PAYME_MERCHANT_ID = os.environ.get("PAYME_MERCHANT_ID", "")
PAYME_SECRET_KEY = os.environ.get("PAYME_SECRET_KEY", "")
PAYME_BASE_URL = os.environ.get("PAYME_BASE_URL", "https://checkout.paycom.uz/api")

# Click config
CLICK_MERCHANT_ID = os.environ.get("CLICK_MERCHANT_ID", "")
CLICK_SERVICE_ID = os.environ.get("CLICK_SERVICE_ID", "")
CLICK_SECRET_KEY = os.environ.get("CLICK_SECRET_KEY", "")


def generate_payme_link(order_id: str, amount_sum: Decimal) -> str:
    """Generate Payme checkout link for a contract payment.

    Args:
        order_id: Contract/order ID
        amount_sum: Amount in UZS (will be converted to tiyin)

    Returns:
        Payme checkout URL
    """
    amount_tiyin = int(amount_sum * 100)

    params = f"m={PAYME_MERCHANT_ID};ac.order_id={order_id};a={amount_tiyin}"
    encoded = base64.b64encode(params.encode()).decode()

    return f"https://checkout.paycom.uz/{encoded}"


def generate_click_link(order_id: str, amount_sum: Decimal) -> str:
    """Generate Click checkout link for a contract payment.

    Args:
        order_id: Contract/order ID
        amount_sum: Amount in UZS

    Returns:
        Click checkout URL
    """
    return (
        f"https://my.click.uz/services/pay"
        f"?service_id={CLICK_SERVICE_ID}"
        f"&merchant_id={CLICK_MERCHANT_ID}"
        f"&amount={int(amount_sum)}"
        f"&transaction_param={order_id}"
    )


def verify_payme_signature(data: dict, auth_header: str) -> bool:
    """Verify Payme callback request authenticity."""
    expected = base64.b64encode(f"{PAYME_MERCHANT_ID}:{PAYME_SECRET_KEY}".encode()).decode()
    return auth_header == f"Basic {expected}"


def verify_click_signature(data: dict) -> bool:
    """Verify Click callback request signature."""
    sign_string = (
        f"{data.get('click_trans_id', '')}"
        f"{data.get('service_id', '')}"
        f"{CLICK_SECRET_KEY}"
        f"{data.get('merchant_trans_id', '')}"
        f"{data.get('amount', '')}"
        f"{data.get('action', '')}"
        f"{data.get('sign_time', '')}"
    )
    sign = hashlib.md5(sign_string.encode()).hexdigest()
    return sign == data.get("sign_string", "")
