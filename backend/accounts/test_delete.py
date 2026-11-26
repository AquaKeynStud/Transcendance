from io import BytesIO

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image
from rest_framework.test import APIClient

from accounts.models import User
from posts.models import Like, Post
from social.models import Follow

MY_PROFILE = '/api/v1/users/me/'
ME = '/api/v1/auth/me/'
PASSWORD = 'correct-horse-battery-42'


def error(response):
    return response.json()['error']


def logged_in_client(username):
    client = APIClient()
    assert client.login(username=username, password=PASSWORD)
    return client


def delete_account(client, password=PASSWORD):
    return client.delete(MY_PROFILE, {'password': password}, format='json')


@pytest.fixture
def alice(make_user):
    return make_user('alice', password=PASSWORD)


def test_delete_account_removes_everything_and_logs_out(make_user, alice):
    bob = make_user('bob')
    post = Post.objects.create(author=alice, title='Mine')
    bob_reply = Post.objects.create(author=bob, is_reply=True, parent=post, content='Hi')
    bob_post = Post.objects.create(author=bob, title='Bob')
    Like.objects.create(user=alice, post=bob_post)
    Follow.objects.create(follower=alice, followed=bob, status=Follow.Status.ACCEPTED)
    Follow.objects.create(follower=bob, followed=alice, status=Follow.Status.ACCEPTED)
    client = logged_in_client('alice')

    response = delete_account(client)
    assert response.status_code == 204
    assert not User.objects.filter(username='alice').exists()
    assert not Post.objects.filter(author_id=alice.pk).exists()
    assert not Like.objects.exists()
    assert not Follow.objects.exists()

    # Other users' replies stay, as "replying to an unavailable post" (§4.2.1).
    bob_reply.refresh_from_db()
    assert bob_reply.is_reply and bob_reply.parent is None

    assert client.get(ME).status_code == 401


def test_other_sessions_end_too(alice):
    this_device = logged_in_client('alice')
    other_device = logged_in_client('alice')
    delete_account(this_device)
    assert other_device.get(ME).status_code == 401


def test_wrong_password_keeps_the_account_and_the_session(alice):
    client = logged_in_client('alice')
    response = delete_account(client, password='wrong')
    assert response.status_code == 400
    assert 'password' in error(response)['fields']
    assert User.objects.filter(username='alice').exists()
    assert client.get(ME).status_code == 200


def test_avatar_file_is_deleted(settings, tmp_path, alice, django_capture_on_commit_callbacks):
    settings.MEDIA_ROOT = tmp_path
    client = logged_in_client('alice')
    buffer = BytesIO()
    Image.new('RGB', (64, 64)).save(buffer, format='PNG')
    client.put(
        '/api/v1/users/me/avatar/',
        {'avatar': SimpleUploadedFile('a.png', buffer.getvalue())},
        format='multipart',
    )
    assert list((tmp_path / 'avatars').iterdir())

    with django_capture_on_commit_callbacks(execute=True):
        delete_account(client)
    assert not list((tmp_path / 'avatars').iterdir())


def test_last_admin_cannot_leave(make_user):
    make_user('root', password=PASSWORD, role=User.Role.ADMIN)
    response = delete_account(logged_in_client('root'))
    assert response.status_code == 409
    assert User.objects.filter(username='root').exists()


def test_an_admin_can_leave_if_another_remains(make_user):
    make_user('root', password=PASSWORD, role=User.Role.ADMIN)
    make_user('root2', role=User.Role.ADMIN)
    assert delete_account(logged_in_client('root')).status_code == 204


@pytest.mark.django_db
def test_visitor_cannot_delete(api_client):
    assert api_client.delete(MY_PROFILE, {'password': 'x'}, format='json').status_code == 401
