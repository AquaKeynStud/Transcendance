"""
Account rules (SPEC_FONC §4.1). Views validate the input, call these functions
and shape the response; the rules themselves live here so they can be reused
and tested on their own.
"""

from django.contrib.auth import authenticate
from django.core.cache import cache
from django.db import IntegrityError, transaction
from rest_framework import exceptions

from core.exceptions import Conflict
from social.models import Follow

from .avatars import process_avatar
from .models import User

# Anti-bruteforce (AUTH rules): 5 failures in 15 minutes block an identifier.
# The per-IP limit is higher on purpose: a whole school network can share one IP.
LOGIN_WINDOW = 15 * 60
MAX_FAILURES_PER_IDENTIFIER = 5
MAX_FAILURES_PER_IP = 20


class AccountBanned(exceptions.PermissionDenied):
    default_code = 'account_banned'
    default_detail = 'This account is banned.'


def register_user(*, username, email, password):
    """Create an account. Raises Conflict (409) if the username or email is taken."""
    taken = {}
    if User.objects.filter(username__iexact=username).exists():
        taken['username'] = ['This username is already taken.']
    if User.objects.filter(email__iexact=email).exists():
        taken['email'] = ['This email is already in use.']
    if taken:
        raise Conflict('This account already exists.', fields=taken)

    try:
        with transaction.atomic():
            return User.objects.create_user(username=username, email=email, password=password)
    except IntegrityError as exc:
        # Two sign-ups with the same name at the same time: the database constraint wins.
        raise Conflict('This account already exists.') from exc


def authenticate_user(request, *, identifier, password):
    """
    Return the user matching these credentials (AUTH-02).

    Raises Throttled (429) after too many failures, AuthenticationFailed (401) on
    wrong credentials and AccountBanned (403) for a banned account. The ban is only
    revealed to someone who knows the password.
    """
    keys = _failure_keys(request, identifier)
    _check_not_blocked(keys)

    username = identifier
    if '@' in identifier:
        match = User.objects.filter(email__iexact=identifier).only('username').first()
        if match:
            username = match.username

    user = authenticate(request, username=username, password=password)
    if user is None:
        _record_failure(keys)
        raise exceptions.AuthenticationFailed('Invalid username, email or password.')

    _reset_failures(keys)
    if user.is_banned:
        reason = user.ban_reason or 'No reason given.'
        raise AccountBanned(f'This account is banned. Reason: {reason}')
    return user


def _failure_keys(request, identifier):
    ip = request.META.get('REMOTE_ADDR', 'unknown')
    return {
        f'login-fail:id:{identifier.strip().lower()}': MAX_FAILURES_PER_IDENTIFIER,
        f'login-fail:ip:{ip}': MAX_FAILURES_PER_IP,
    }


def _check_not_blocked(keys):
    for key, limit in keys.items():
        if cache.get(key, 0) >= limit:
            raise exceptions.Throttled(
                wait=LOGIN_WINDOW, detail='Too many failed attempts. Try again later.'
            )


def _record_failure(keys):
    for key in keys:
        # The window starts at the first failure; add() only creates a missing key.
        cache.add(key, 0, timeout=LOGIN_WINDOW)
        try:
            cache.incr(key)
        except ValueError:
            # The key expired between add() and incr(): start a new window.
            cache.set(key, 1, timeout=LOGIN_WINDOW)


def _reset_failures(keys):
    cache.delete_many(list(keys))


# --- Profile (SPEC_FONC §4.2) -------------------------------------------------


@transaction.atomic
def update_profile(user, **changes):
    """
    Apply a partial update of the own account (ACC-03, ACC-05, ACC-06).

    A private account that turns public accepts its pending follow requests
    (SPEC_FONC §3.1), in the same transaction.
    """
    new_username = changes.get('username')
    if new_username and new_username.lower() != user.username.lower():
        if User.objects.filter(username__iexact=new_username).exclude(pk=user.pk).exists():
            raise Conflict(
                'This username is already taken.',
                fields={'username': ['This username is already taken.']},
            )

    was_private = user.is_private
    for field, value in changes.items():
        setattr(user, field, value)
    try:
        with transaction.atomic():
            user.save(update_fields=list(changes))
    except IntegrityError as exc:
        raise Conflict(
            'This username is already taken.',
            fields={'username': ['This username is already taken.']},
        ) from exc

    if was_private and not user.is_private:
        Follow.objects.filter(followed=user, status=Follow.Status.PENDING).update(
            status=Follow.Status.ACCEPTED
        )
    return user


def set_avatar(user, uploaded):
    """Replace the avatar (ACC-04). The previous file is deleted (MEDIA-07)."""
    content = process_avatar(uploaded)
    old_name = user.avatar.name
    user.avatar.save(content.name, content, save=False)
    user.save(update_fields=['avatar'])
    if old_name:
        user.avatar.storage.delete(old_name)
    return user


def remove_avatar(user):
    """Back to the default avatar: the front shows it when `avatar` is null."""
    if user.avatar:
        user.avatar.delete(save=False)
        user.save(update_fields=['avatar'])
    return user
