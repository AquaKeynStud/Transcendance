import pytest
from rest_framework.test import APIClient

EMAIL = '/api/v1/users/me/email/'
PASSWORD = '/api/v1/users/me/password/'
ME = '/api/v1/auth/me/'

OLD = 'correct-horse-battery-42'
NEW = 'another-strong-pass-77'


def error(response):
    return response.json()['error']


@pytest.fixture
def alice(make_user):
    return make_user('alice', email='alice@example.com', password=OLD)


def logged_in_client(username, password):
    """A client with a real session, not force_authenticate: sessions matter here."""
    client = APIClient()
    assert client.login(username=username, password=password)
    return client


# --- Email (ACC-05) -----------------------------------------------------------


def test_change_email(alice):
    client = logged_in_client('alice', OLD)
    response = client.post(EMAIL, {'email': 'new@example.com', 'current_password': OLD})
    assert response.status_code == 200
    assert response.json()['email'] == 'new@example.com'


def test_change_email_needs_the_right_password(alice):
    client = logged_in_client('alice', OLD)
    response = client.post(EMAIL, {'email': 'new@example.com', 'current_password': 'wrong'})
    assert response.status_code == 400
    assert 'current_password' in error(response)['fields']
    alice.refresh_from_db()
    assert alice.email == 'alice@example.com'


def test_taken_email_is_a_conflict(make_user, alice):
    make_user('bob', email='bob@example.com')
    client = logged_in_client('alice', OLD)
    response = client.post(EMAIL, {'email': 'BOB@example.com', 'current_password': OLD})
    assert response.status_code == 409
    assert list(error(response)['fields']) == ['email']


def test_invalid_email_is_rejected(alice):
    client = logged_in_client('alice', OLD)
    response = client.post(EMAIL, {'email': 'nope', 'current_password': OLD})
    assert response.status_code == 400
    assert 'email' in error(response)['fields']


# --- Password (ACC-05) --------------------------------------------------------


def password_payload(**overrides):
    payload = {'current_password': OLD, 'new_password': NEW, 'new_password_confirm': NEW}
    payload.update(overrides)
    return payload


def test_change_password_keeps_this_session_and_closes_the_others(alice):
    this_device = logged_in_client('alice', OLD)
    other_device = logged_in_client('alice', OLD)

    response = this_device.post(PASSWORD, password_payload())
    assert response.status_code == 204

    assert this_device.get(ME).status_code == 200
    assert other_device.get(ME).status_code == 401
    alice.refresh_from_db()
    assert alice.check_password(NEW)


@pytest.mark.parametrize(
    'overrides, field',
    [
        ({'current_password': 'wrong'}, 'current_password'),
        ({'new_password_confirm': 'something-else-99'}, 'new_password_confirm'),
        ({'new_password': 'password', 'new_password_confirm': 'password'}, 'new_password'),
        # Too close to the username for Django's similarity validator (77% > 70%).
        ({'new_password': 'alice123', 'new_password_confirm': 'alice123'}, 'new_password'),
    ],
)
def test_password_change_errors(alice, overrides, field):
    client = logged_in_client('alice', OLD)
    response = client.post(PASSWORD, password_payload(**overrides))
    assert response.status_code == 400
    assert field in error(response)['fields']
    alice.refresh_from_db()
    assert alice.check_password(OLD)


@pytest.mark.django_db
def test_visitor_cannot_change_anything(api_client):
    assert api_client.post(EMAIL, {}).status_code == 401
    assert api_client.post(PASSWORD, {}).status_code == 401
