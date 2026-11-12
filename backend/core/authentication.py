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
