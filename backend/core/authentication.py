from drf_spectacular.authentication import SessionScheme
from rest_framework import authentication


class SessionAuthentication(authentication.SessionAuthentication):
    """
    Cookie-based session authentication (SPEC_TECH §2).

    DRF's class defines no `WWW-Authenticate` header, so DRF answers 403 to an
    anonymous visitor. The spec requires 401 (VIS-06): declaring a scheme makes
    DRF return 401 for `NotAuthenticated`.
    """

    def authenticate_header(self, request):
        return 'Session'


class SessionAuthenticationScheme(SessionScheme):
    """Tells the OpenAPI schema that our subclass is the session cookie scheme."""

    target_class = 'core.authentication.SessionAuthentication'


class EnforceCsrfMixin:
    """
    Checks the CSRF token even for anonymous requests.

    DRF only checks CSRF for users already logged in by session. Login and
    register are called by visitors, so without this a third-party site could
    log a victim into the attacker's account ("login CSRF"). A failure goes
    through the API error format (403), not Django's HTML error page.
    """

    def initial(self, request, *args, **kwargs):
        SessionAuthentication().enforce_csrf(request)
        super().initial(request, *args, **kwargs)
