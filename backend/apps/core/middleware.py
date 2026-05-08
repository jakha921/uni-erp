"""Core middleware — AuditMiddleware."""

import json


class AuditMiddleware:
    """Log POST/PATCH/PUT/DELETE requests to AuditLog after response."""

    AUDIT_METHODS = {"POST", "PATCH", "PUT", "DELETE"}

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)

        if (
            request.method in self.AUDIT_METHODS
            and request.user
            and request.user.is_authenticated
            and response.status_code < 400
            and request.path.startswith("/api/")
        ):
            self._log(request, response)

        return response

    def _log(self, request, response):
        from apps.core.models import AuditLog

        action_map = {"POST": "create", "PATCH": "update", "PUT": "update", "DELETE": "delete"}
        action = action_map.get(request.method, "update")

        path_parts = [p for p in request.path.strip("/").split("/") if p]
        model_name = path_parts[2] if len(path_parts) >= 3 else request.path
        object_id = path_parts[3] if len(path_parts) >= 4 else ""

        try:
            body = json.loads(request.body.decode("utf-8")) if request.body else {}
        except Exception:
            body = {}

        ip = request.META.get("HTTP_X_FORWARDED_FOR", request.META.get("REMOTE_ADDR", ""))
        if "," in ip:
            ip = ip.split(",")[0].strip()

        AuditLog.objects.create(
            user=request.user,
            action=action,
            model=model_name,
            object_id=str(object_id),
            path=request.path,
            changes=body,
            ip_address=ip or None,
        )
