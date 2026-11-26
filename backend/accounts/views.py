from django.contrib.auth import login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import ensure_csrf_cookie
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.authentication import EnforceCsrfMixin

from . import services
from .serializers import LoginSerializer, MeSerializer, RegisterSerializer


@method_decorator(ensure_csrf_cookie, name='dispatch')
class CsrfView(APIView):
    """Sets the `csrftoken` cookie. The front calls it once before any form."""

    permission_classes = [AllowAny]

    @extend_schema(responses={204: OpenApiResponse(description='The csrftoken cookie is set.')})
    def get(self, request):
        return Response(status=status.HTTP_204_NO_CONTENT)


class RegisterView(EnforceCsrfMixin, APIView):
    """Create an account and log it in (AUTH-01)."""

    permission_classes = [AllowAny]

    @extend_schema(request=RegisterSerializer, responses={201: MeSerializer})
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        user = services.register_user(
            username=data['username'], email=data['email'], password=data['password']
        )
        login(request, user, backend='django.contrib.auth.backends.ModelBackend')
        return Response(MeSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(EnforceCsrfMixin, APIView):
    """Log in with a username or an email (AUTH-02)."""

    permission_classes = [AllowAny]

    @extend_schema(request=LoginSerializer, responses={200: MeSerializer})
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = services.authenticate_user(
            request,
            identifier=serializer.validated_data['login'],
            password=serializer.validated_data['password'],
        )
        login(request, user)
        return Response(MeSerializer(user).data)


class LogoutView(APIView):
    """
    Close the session (AUTH-03). Always answers 204, even if already logged out.

    Django sends the `user_logged_out` signal here: the realtime app can listen
    to it to close the user's WebSockets.
    """

    permission_classes = [AllowAny]

    @extend_schema(request=None, responses={204: OpenApiResponse(description='Logged out.')})
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    """The logged-in user's account. 401 for a visitor."""

    permission_classes = [IsAuthenticated]

    @extend_schema(responses={200: MeSerializer})
    def get(self, request):
        return Response(MeSerializer(request.user).data)
