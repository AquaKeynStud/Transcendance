import pytest
from django.core.cache import cache
from rest_framework.test import APIClient

from accounts.models import User

CSRF = '/api/v1/auth/csrf/'
REGISTER = '/api/v1/auth/register/'
LOGIN = '/api/v1/auth/login/'
LOGOUT = '/api/v1/auth/logout/'
ME = '/api/v1/auth/me/'

STRONG_PASSWORD = 'correct-horse-battery-42'


@pytest.fixture(autouse=True)
def clear_cache():
    # Anti-bruteforce counters live in the cache: never let them leak between tests.
    cache.clear()
    yield
    cache.clear()


def register_payload(**overrides):
    payload = {
        'username': 'alice',
        'email': 'alice@example.com',
        'password': STRONG_PASSWORD,
        'password_confirm': STRONG_PASSWORD,
        'accept_terms': True,
    }
    payload.update(overrides)
    return payload


def error(response):
    return response.json()['error']


# --- CSRF ---------------------------------------------------------------------


def test_csrf_endpoint_sets_the_cookie(api_client):
    response = api_client.get(CSRF)
    assert response.status_code == 204
    assert 'csrftoken' in response.cookies


@pytest.mark.django_db
def test_login_without_csrf_token_is_refused():
    client = APIClient(enforce_csrf_checks=True)
    response = client.post(LOGIN, {'login': 'alice', 'password': 'x'})
    assert response.status_code == 403
    assert error(response)['code'] == 'permission_denied'


def test_login_with_csrf_token_works(make_user):
    make_user('alice', password=STRONG_PASSWORD)
    client = APIClient(enforce_csrf_checks=True)
    client.get(CSRF)
    token = client.cookies['csrftoken'].value
    response = client.post(
        LOGIN, {'login': 'alice', 'password': STRONG_PASSWORD}, HTTP_X_CSRFTOKEN=token
    )
    assert response.status_code == 200


# --- Register (AUTH-01) -------------------------------------------------------


@pytest.mark.django_db
def test_register_creates_and_logs_in(api_client):
    response = api_client.post(REGISTER, register_payload())
    assert response.status_code == 201
    assert response.json()['username'] == 'alice'
    assert 'password' not in response.json()

    user = User.objects.get(username='alice')
    assert user.check_password(STRONG_PASSWORD)
    assert api_client.get(ME).status_code == 200


@pytest.mark.django_db
@pytest.mark.parametrize(
    'overrides, field',
    [
        ({'username': 'ab'}, 'username'),
        ({'username': 'with space'}, 'username'),
        ({'email': 'not-an-email'}, 'email'),
        ({'password_confirm': 'something-else-42'}, 'password_confirm'),
        ({'password': 'password', 'password_confirm': 'password'}, 'password'),
        ({'accept_terms': False}, 'accept_terms'),
    ],
)
def test_register_validation_errors(api_client, overrides, field):
    response = api_client.post(REGISTER, register_payload(**overrides))
    assert response.status_code == 400
    assert error(response)['code'] == 'validation_error'
    assert field in error(response)['fields']
    assert not User.objects.exists()


def test_register_with_a_taken_username_is_a_conflict(api_client, make_user):
    make_user('alice')
    response = api_client.post(
        REGISTER, register_payload(username='ALICE', email='other@example.com')
    )
    assert response.status_code == 409
    assert error(response)['code'] == 'conflict'
    assert list(error(response)['fields']) == ['username']


def test_register_with_a_taken_email_is_a_conflict(api_client, make_user):
    make_user('alice', email='alice@example.com')
    response = api_client.post(
        REGISTER, register_payload(username='bob', email='Alice@Example.com')
    )
    assert response.status_code == 409
    assert list(error(response)['fields']) == ['email']


# --- Login (AUTH-02) ----------------------------------------------------------


@pytest.fixture
def alice(make_user):
    return make_user('alice', email='alice@example.com', password=STRONG_PASSWORD)


@pytest.mark.parametrize('identifier', ['alice', 'ALICE', 'alice@example.com', 'Alice@Example.COM'])
def test_login_by_username_or_email(api_client, alice, identifier):
    response = api_client.post(LOGIN, {'login': identifier, 'password': STRONG_PASSWORD})
    assert response.status_code == 200
    assert response.json()['username'] == 'alice'
    assert api_client.get(ME).json()['username'] == 'alice'


def test_login_with_a_wrong_password(api_client, alice):
    response = api_client.post(LOGIN, {'login': 'alice', 'password': 'wrong'})
    assert response.status_code == 401
    assert error(response)['code'] == 'authentication_failed'


@pytest.mark.django_db
def test_login_with_an_unknown_account(api_client):
    response = api_client.post(LOGIN, {'login': 'nobody@example.com', 'password': 'x'})
    assert response.status_code == 401


def test_banned_user_sees_the_reason(api_client, alice):
    alice.is_banned = True
    alice.ban_reason = 'Spam'
    alice.save()
    response = api_client.post(LOGIN, {'login': 'alice', 'password': STRONG_PASSWORD})
    assert response.status_code == 403
    assert error(response)['code'] == 'account_banned'
    assert 'Spam' in error(response)['message']
    assert api_client.get(ME).status_code == 401


def test_ban_is_not_revealed_without_the_password(api_client, alice):
    alice.is_banned = True
    alice.save()
    response = api_client.post(LOGIN, {'login': 'alice', 'password': 'wrong'})
    assert response.status_code == 401


def test_login_is_blocked_after_five_failures(api_client, alice):
    for _ in range(5):
        response = api_client.post(LOGIN, {'login': 'alice', 'password': 'wrong'})
        assert response.status_code == 401
    # Even the right password is refused while blocked.
    response = api_client.post(LOGIN, {'login': 'alice', 'password': STRONG_PASSWORD})
    assert response.status_code == 429
    assert error(response)['code'] == 'throttled'
    assert 'Retry-After' in response


def test_a_success_resets_the_failure_counter(api_client, alice):
    good = {'login': 'alice', 'password': STRONG_PASSWORD}
    bad = {'login': 'alice', 'password': 'wrong'}
    for _ in range(4):
        api_client.post(LOGIN, bad)
    assert api_client.post(LOGIN, good).status_code == 200
    for _ in range(4):
        api_client.post(LOGIN, bad)
    assert api_client.post(LOGIN, good).status_code == 200


# --- Logout and me (AUTH-03) --------------------------------------------------


def test_logout_closes_the_session(api_client, alice):
    api_client.post(LOGIN, {'login': 'alice', 'password': STRONG_PASSWORD})
    assert api_client.post(LOGOUT).status_code == 204
    assert api_client.get(ME).status_code == 401


@pytest.mark.django_db
def test_logout_when_already_logged_out(api_client):
    assert api_client.post(LOGOUT).status_code == 204


@pytest.mark.django_db
def test_me_requires_login(api_client):
    response = api_client.get(ME)
    assert response.status_code == 401
    assert error(response)['code'] == 'not_authenticated'
