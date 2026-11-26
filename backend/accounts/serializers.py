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


class PublicProfileSerializer(serializers.ModelSerializer):
    """
    Profile header (ACC-01), visible to everyone, visitors included, even for a
    private account (SPEC_FONC §3.1). The counters come from `annotate()` in the view.
    """

    post_count = serializers.IntegerField(read_only=True)
    follower_count = serializers.IntegerField(read_only=True)
    following_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'display_name',
            'bio',
            'avatar',
            'is_private',
            'date_joined',
            'post_count',
            'follower_count',
            'following_count',
        ]
        read_only_fields = fields


class AvatarUploadSerializer(serializers.Serializer):
    """Multipart upload of a new avatar. Format and size are checked by accounts.avatars."""

    avatar = serializers.FileField()


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Editable part of the own account (ACC-03, ACC-05, ACC-06). Every field is
    optional (PATCH). Username uniqueness is checked by the service (409).
    """

    username = serializers.CharField(max_length=20, validators=[username_validator])

    class Meta:
        model = User
        fields = [
            'username',
            'display_name',
            'bio',
            'is_private',
            'likes_visibility',
            'reposts_visibility',
        ]
