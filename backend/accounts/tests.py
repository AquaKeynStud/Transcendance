import pytest
from django.core.exceptions import ValidationError
from django.db import IntegrityError, transaction

from accounts.models import User


def test_username_is_unique_regardless_of_case(make_user):
    make_user('alice')
    with pytest.raises(IntegrityError), transaction.atomic():
        make_user('Alice', email='other@example.com')


def test_email_is_unique_regardless_of_case(make_user):
    make_user('alice', email='alice@example.com')
    with pytest.raises(IntegrityError), transaction.atomic():
        make_user('bob', email='ALICE@example.com')


@pytest.mark.parametrize('username', ['ab', 'a' * 21, 'with space', 'dash-name', 'émile'])
def test_invalid_usernames_are_rejected(db, username):
    user = User(username=username, email='x@example.com')
    with pytest.raises(ValidationError) as excinfo:
        user.full_clean(exclude=['password'])
    assert 'username' in excinfo.value.message_dict


def test_login_lookup_ignores_case(make_user):
    alice = make_user('alice')
    assert User.objects.get_by_natural_key('ALICE') == alice


def test_defaults(make_user):
    user = make_user('alice')
    assert user.role == User.Role.USER
    assert not user.is_admin
    assert not user.is_private
    assert user.likes_visibility == User.Visibility.PUBLIC
    assert user.reposts_visibility == User.Visibility.PUBLIC
    assert not user.is_banned


@pytest.mark.django_db
def test_superuser_is_an_admin():
    admin = User.objects.create_superuser('root', 'root@example.com', 'password123')
    assert admin.is_admin


def test_password_is_hashed(make_user):
    user = make_user('alice', password='password123')
    assert user.password != 'password123'
    assert user.check_password('password123')
