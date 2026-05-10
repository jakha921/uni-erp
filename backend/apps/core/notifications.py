"""Notification service — sends in-app notifications and optionally SMS."""

from apps.operations.models import Notification


def notify_user(
    user,
    title: str,
    message: str,
    notification_type: str = "info",
    link: str = "",
    send_sms: bool = False,
) -> Notification:
    """Create in-app notification and optionally send SMS.

    Args:
        user: User instance
        title: Notification title
        message: Notification body
        notification_type: info|warning|success|error|system
        link: Optional deep link
        send_sms: Also send SMS to user's phone
    """
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type=notification_type,
        link=link,
    )

    if send_sms and hasattr(user, "phone") and user.phone:
        from apps.core.sms import send_sms as _send_sms

        _send_sms(user.phone, f"{title}: {message}"[:160])

    return notification


def notify_bulk(
    users,
    title: str,
    message: str,
    notification_type: str = "info",
    link: str = "",
    send_sms: bool = False,
) -> int:
    """Send notification to multiple users."""
    notifications = [
        Notification(
            user=user,
            title=title,
            message=message,
            type=notification_type,
            link=link,
        )
        for user in users
    ]
    Notification.objects.bulk_create(notifications)

    if send_sms:
        from apps.core.sms import send_bulk_sms

        recipients = [
            {"phone": u.phone, "message": f"{title}: {message}"[:160]}
            for u in users
            if hasattr(u, "phone") and u.phone
        ]
        if recipients:
            send_bulk_sms(recipients)

    return len(notifications)
