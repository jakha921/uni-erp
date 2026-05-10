"""SMS notification service via Eskiz API (eskiz.uz)."""

import logging
import os

import requests

logger = logging.getLogger(__name__)

ESKIZ_BASE_URL = "https://notify.eskiz.uz/api"
ESKIZ_EMAIL = os.environ.get("ESKIZ_EMAIL", "")
ESKIZ_PASSWORD = os.environ.get("ESKIZ_PASSWORD", "")

_token_cache: dict[str, str] = {}


def _get_token() -> str:
    """Get or refresh Eskiz API token."""
    if "token" in _token_cache:
        return _token_cache["token"]

    if not ESKIZ_EMAIL or not ESKIZ_PASSWORD:
        logger.warning("Eskiz credentials not configured")
        return ""

    try:
        resp = requests.post(
            f"{ESKIZ_BASE_URL}/auth/login",
            data={"email": ESKIZ_EMAIL, "password": ESKIZ_PASSWORD},
            timeout=10,
        )
        resp.raise_for_status()
        token = resp.json().get("data", {}).get("token", "")
        _token_cache["token"] = token
        return token
    except Exception as e:
        logger.error(f"Eskiz auth failed: {e}")
        return ""


def send_sms(phone: str, message: str) -> bool:
    """Send SMS to a single phone number.

    Args:
        phone: Phone number in format +998XXXXXXXXX
        message: SMS text (max 160 chars for Latin, 70 for Cyrillic)

    Returns:
        True if sent successfully
    """
    token = _get_token()
    if not token:
        logger.warning(f"SMS not sent (no token): {phone}")
        return False

    clean_phone = phone.replace("+", "").replace(" ", "").replace("-", "")

    try:
        resp = requests.post(
            f"{ESKIZ_BASE_URL}/message/sms/send",
            headers={"Authorization": f"Bearer {token}"},
            data={
                "mobile_phone": clean_phone,
                "message": message,
                "from": "4546",
            },
            timeout=10,
        )
        resp.raise_for_status()
        result = resp.json()
        success = result.get("status") == "waiting"
        if success:
            logger.info(f"SMS sent to {phone}")
        else:
            logger.warning(f"SMS send failed: {result}")
        return success
    except Exception as e:
        logger.error(f"SMS send error: {e}")
        return False


def send_bulk_sms(recipients: list[dict[str, str]]) -> dict[str, int]:
    """Send SMS to multiple recipients.

    Args:
        recipients: List of {"phone": "+998...", "message": "..."} dicts

    Returns:
        {"sent": N, "failed": M}
    """
    sent = 0
    failed = 0
    for r in recipients:
        if send_sms(r["phone"], r["message"]):
            sent += 1
        else:
            failed += 1
    return {"sent": sent, "failed": failed}
