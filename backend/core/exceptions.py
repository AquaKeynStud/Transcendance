"""
Single error format for the whole API (SPEC_TECH §3):

    {
      "error": {
        "code": "validation_error",
        "message": "Some fields are invalid.",
        "fields": {"username": ["This username is already taken."]}
      }
    }

`fields` is always present (an empty object outside validation errors), so the
front only has one type to handle.
"""

from django.core.exceptions import PermissionDenied as DjangoPermissionDenied
from django.http import Http404
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions
from rest_framework.settings import api_settings
from rest_framework.views import exception_handler

VALIDATION_MESSAGE = _('Some fields are invalid.')


def api_exception_handler(exc, context):
    # Same conversions DRF does internally, done first so we know the final code.
    if isinstance(exc, Http404):
        exc = exceptions.NotFound()
    elif isinstance(exc, DjangoPermissionDenied):
        exc = exceptions.PermissionDenied()

    response = exception_handler(exc, context)
    if response is None:
        # Unexpected error: let Django return a 500 (with a traceback in DEBUG).
        return None

    if isinstance(exc, exceptions.ValidationError):
        code, message, fields = _validation_error(exc.detail)
    else:
        code = getattr(exc, 'default_code', 'error')
        message = _detail_to_message(exc.detail)
        fields = {}

    response.data = {'error': {'code': code, 'message': message, 'fields': fields}}
    return response


def _validation_error(detail):
    non_field_key = api_settings.NON_FIELD_ERRORS_KEY
    message = str(VALIDATION_MESSAGE)
    fields = {}

    if isinstance(detail, dict):
        fields = {key: value for key, value in detail.items() if key != non_field_key}
        non_field_errors = detail.get(non_field_key)
        if non_field_errors:
            message = str(non_field_errors[0])
    elif isinstance(detail, list) and detail:
        message = str(detail[0])

    return 'validation_error', message, fields


def _detail_to_message(detail):
    if isinstance(detail, list) and detail:
        return _detail_to_message(detail[0])
    if isinstance(detail, dict) and detail:
        return _detail_to_message(next(iter(detail.values())))
    return str(detail)
