import uuid
from pathlib import Path

from django.contrib.auth.models import AbstractUser, UserManager
from django.core.validators import RegexValidator
from django.db import models
from django.db.models.functions import Lower

username_validator = RegexValidator(
    regex=r'^[A-Za-z0-9_]{3,20}$',
    message='Username must be 3 to 20 characters: letters, digits and underscores only.',
)


def avatar_upload_to(instance, filename):
    # Uploaded files are renamed with a random UUID (SPEC_TECH §6).
    return f'avatars/{uuid.uuid4().hex}{Path(filename).suffix.lower()}'


class Manager(UserManager):
    def get_by_natural_key(self, username):
        # Usernames are unique regardless of case (AUTH-01): `Alice` logs in as `alice`.
        return self.get(username__iexact=username)

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        # The first admin is created with `createsuperuser` (SPEC_FONC §2).
        extra_fields.setdefault('role', User.Role.ADMIN)
        return super().create_superuser(username, email, password, **extra_fields)


class User(AbstractUser):
    """
    Platform account (SPEC_FONC §6).

    `role` drives the API permissions (user / admin). `is_staff` and `is_superuser`
    only give access to the Django admin site, which is a dev tool.
    `date_joined` (inherited) is the account creation date.
    """

    class Role(models.TextChoices):
        USER = 'user'
        ADMIN = 'admin'

    class Visibility(models.TextChoices):
        PUBLIC = 'public'
        FOLLOWERS = 'followers'
        PRIVATE = 'private'

    # Not used by the product: the profile has a single display name.
    first_name = None
    last_name = None

    username = models.CharField(
        max_length=20,
        unique=True,
        validators=[username_validator],
        error_messages={'unique': 'This username is already taken.'},
    )
    email = models.EmailField(
        unique=True,
        error_messages={'unique': 'This email is already in use.'},
    )
    display_name = models.CharField(max_length=50, blank=True)
    bio = models.CharField(max_length=160, blank=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, blank=True)

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)
    is_private = models.BooleanField(default=False)
    likes_visibility = models.CharField(
        max_length=10, choices=Visibility.choices, default=Visibility.PUBLIC
    )
    reposts_visibility = models.CharField(
        max_length=10, choices=Visibility.choices, default=Visibility.PUBLIC
    )

    is_banned = models.BooleanField(default=False)
    ban_reason = models.TextField(blank=True)
    last_seen = models.DateTimeField(null=True, blank=True)

    objects = Manager()

    class Meta:
        constraints = [
            # `unique=True` above is case-sensitive; these make `Alice` and `alice` collide.
            models.UniqueConstraint(Lower('username'), name='accounts_user_username_ci_unique'),
            models.UniqueConstraint(Lower('email'), name='accounts_user_email_ci_unique'),
            models.CheckConstraint(
                condition=models.Q(role__in=['user', 'admin']),
                name='accounts_user_role_valid',
            ),
        ]

    def __str__(self):
        return self.username

    @property
    def is_admin(self):
        return self.role == self.Role.ADMIN

    def get_full_name(self):
        return self.display_name or self.username

    def get_short_name(self):
        return self.get_full_name()
