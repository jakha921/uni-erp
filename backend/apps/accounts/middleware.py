"""RoleMiddleware — attaches request.current_role from the user's primary UserRole."""

from django.http import HttpRequest

from .permissions import get_primary_role


class RoleMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        if request.user.is_authenticated:
            request.current_role = get_primary_role(request.user)
        else:
            request.current_role = None
        return self.get_response(request)
