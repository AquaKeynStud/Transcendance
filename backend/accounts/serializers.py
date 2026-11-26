from django.contrib.auth import password_validation
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import serializers

from .models import User, username_validator


class MeSerializer(serializers.ModelSerializer):
    """The logged-in user's own account, as returned by login, register and /me."""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'display_name',
            'bio',
            'avatar',
            'role',
            'is_private',
            'likes_visibility',
            'reposts_visibility',
            'date_joined',
        ]
        read_only_fields = fields


class RegisterSerializer(serializers.Serializer):
    """
    Input of the sign-up form (AUTH-01).

    Uniqueness of the username and email is not checked here: the service does
    it case-insensitively and answers 409, as the spec requires (SPEC_TECH §3).
    """

    username = serializers.CharField(max_length=20, validators=[username_validator])
    email = serializers.EmailField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    password_confirm = serializers.CharField(write_only=True, trim_whitespace=False)
    accept_terms = serializers.BooleanField()

    def validate_accept_terms(self, value):
        if not value:
            raise serializers.ValidationError(
                'You must accept the terms of service and the privacy policy.'
            )
        return value

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': ['Passwords do not match.']})
        # Django's validators (length, common passwords, similarity to the username...).
        candidate = User(username=attrs['username'], email=attrs['email'])
        try:
            password_validation.validate_password(attrs['password'], user=candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({'password': list(exc.messages)}) from exc
        return attrs


class LoginSerializer(serializers.Serializer):
    """Input of the login form (AUTH-02): a username or an email, and a password."""

    login = serializers.CharField(max_length=254)
    password = serializers.CharField(write_only=True, trim_whitespace=False)
