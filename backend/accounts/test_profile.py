import pytest
from django.utils import timezone

from accounts.models import User
from posts.models import Post
from social.models import Follow

MY_PROFILE = '/api/v1/users/me/'
ACCEPTED, PENDING = Follow.Status.ACCEPTED, Follow.Status.PENDING


def profile_url(username):
    return f'/api/v1/users/{username}/'


def error(response):
    return response.json()['error']


@pytest.fixture
def alice(make_user):
    return make_user('alice', display_name='Alice', bio='Hello')


# --- Public profile (ACC-01) --------------------------------------------------


def test_visitor_sees_a_profile_with_its_counters(api_client, make_user, alice):
    bob, charlie = make_user('bob'), make_user('charlie')
    Follow.objects.create(follower=bob, followed=alice, status=ACCEPTED)
    Follow.objects.create(follower=charlie, followed=alice, status=PENDING)
    Follow.objects.create(follower=alice, followed=bob, status=ACCEPTED)
    post = Post.objects.create(author=alice, title='Kept')
    Post.objects.create(author=alice, is_reply=True, parent=post, content='Not counted')
    Post.objects.create(author=alice, title='Gone', deleted_at=timezone.now())

    response = api_client.get(profile_url('alice'))
    assert response.status_code == 200
    body = response.json()
    assert body['username'] == 'alice'
    assert body['display_name'] == 'Alice'
    assert body['post_count'] == 1  # replies and deleted posts are not counted
    assert body['follower_count'] == 1  # pending requests are not counted
    assert body['following_count'] == 1
    assert 'email' not in body


def test_private_profile_header_is_visible(api_client, make_user):
    make_user('bob', is_private=True)
    response = api_client.get(profile_url('bob'))
    assert response.status_code == 200
    assert response.json()['is_private'] is True


def test_profile_lookup_ignores_case(api_client, alice):
    assert api_client.get(profile_url('ALICE')).status_code == 200


@pytest.mark.django_db
def test_unknown_profile_is_404(api_client):
    response = api_client.get(profile_url('nobody'))
    assert response.status_code == 404
    assert error(response)['code'] == 'not_found'


def test_banned_profile_is_hidden_except_for_admins(api_client, make_user, alice):
    alice.is_banned = True
    alice.save()
    assert api_client.get(profile_url('alice')).status_code == 404

    api_client.force_authenticate(make_user('root', role=User.Role.ADMIN))
    assert api_client.get(profile_url('alice')).status_code == 200


# --- Edit the own profile (ACC-03, ACC-05, ACC-06) ----------------------------


@pytest.mark.django_db
def test_visitor_cannot_edit(api_client):
    assert api_client.patch(MY_PROFILE, {'bio': 'x'}).status_code == 401


def test_edit_display_name_and_bio(api_client, alice):
    api_client.force_authenticate(alice)
    response = api_client.patch(MY_PROFILE, {'display_name': 'Alice B.', 'bio': 'New bio'})
    assert response.status_code == 200
    assert response.json()['bio'] == 'New bio'
    alice.refresh_from_db()
    assert alice.display_name == 'Alice B.'
    assert alice.username == 'alice'  # untouched fields stay as they were


@pytest.mark.parametrize(
    'payload, field',
    [
        ({'display_name': 'x' * 51}, 'display_name'),
        ({'bio': 'x' * 161}, 'bio'),
        ({'username': 'no spaces allowed'}, 'username'),
        ({'likes_visibility': 'everyone'}, 'likes_visibility'),
    ],
)
def test_edit_validation_errors(api_client, alice, payload, field):
    api_client.force_authenticate(alice)
    response = api_client.patch(MY_PROFILE, payload)
    assert response.status_code == 400
    assert field in error(response)['fields']


def test_change_username(api_client, alice):
    api_client.force_authenticate(alice)
    response = api_client.patch(MY_PROFILE, {'username': 'alice_b'})
    assert response.status_code == 200
    assert response.json()['username'] == 'alice_b'


def test_change_username_case_only(api_client, alice):
    api_client.force_authenticate(alice)
    response = api_client.patch(MY_PROFILE, {'username': 'Alice'})
    assert response.status_code == 200


def test_taken_username_is_a_conflict(api_client, make_user, alice):
    make_user('bob')
    api_client.force_authenticate(alice)
    response = api_client.patch(MY_PROFILE, {'username': 'BOB'})
    assert response.status_code == 409
    assert list(error(response)['fields']) == ['username']


def test_privacy_settings(api_client, alice):
    api_client.force_authenticate(alice)
    response = api_client.patch(
        MY_PROFILE,
        {'is_private': True, 'likes_visibility': 'followers', 'reposts_visibility': 'private'},
    )
    assert response.status_code == 200
    alice.refresh_from_db()
    assert alice.is_private
    assert alice.likes_visibility == User.Visibility.FOLLOWERS
    assert alice.reposts_visibility == User.Visibility.PRIVATE


def test_going_public_accepts_pending_requests(api_client, make_user):
    bob = make_user('bob', is_private=True)
    charlie = make_user('charlie')
    Follow.objects.create(follower=charlie, followed=bob, status=PENDING)
    api_client.force_authenticate(bob)

    api_client.patch(MY_PROFILE, {'is_private': False})
    assert Follow.objects.get(follower=charlie, followed=bob).status == ACCEPTED


def test_going_private_keeps_existing_followers(api_client, make_user, alice):
    bob = make_user('bob')
    Follow.objects.create(follower=bob, followed=alice, status=ACCEPTED)
    api_client.force_authenticate(alice)

    api_client.patch(MY_PROFILE, {'is_private': True})
    assert Follow.objects.get(follower=bob, followed=alice).status == ACCEPTED
