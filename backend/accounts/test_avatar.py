from io import BytesIO

import pytest
from django.core.files.uploadedfile import SimpleUploadedFile
from PIL import Image

AVATAR = '/api/v1/users/me/avatar/'


@pytest.fixture(autouse=True)
def media_root(settings, tmp_path):
    # Uploaded files go to a temporary folder, never to the real media/ directory.
    settings.MEDIA_ROOT = tmp_path
    return tmp_path


@pytest.fixture
def alice(api_client, make_user):
    user = make_user('alice')
    api_client.force_authenticate(user)
    return user


def image_file(name='photo.png', image_format='PNG', size=(800, 600), mode='RGB'):
    buffer = BytesIO()
    Image.new(mode, size, 'teal').save(buffer, format=image_format)
    return SimpleUploadedFile(name, buffer.getvalue())


def upload(api_client, file):
    return api_client.put(AVATAR, {'avatar': file}, format='multipart')


def error(response):
    return response.json()['error']


@pytest.mark.parametrize(
    'name, image_format, mode',
    [('a.png', 'PNG', 'RGBA'), ('a.jpg', 'JPEG', 'RGB'), ('a.webp', 'WEBP', 'RGB')],
)
def test_upload_crops_to_a_square_webp(api_client, alice, name, image_format, mode):
    response = upload(api_client, image_file(name, image_format, mode=mode))
    assert response.status_code == 200
    assert response.json()['avatar'].endswith('.webp')

    alice.refresh_from_db()
    with Image.open(alice.avatar.path) as stored:
        assert stored.format == 'WEBP'
        assert stored.size == (512, 512)


def test_replacing_deletes_the_previous_file(api_client, alice, media_root):
    upload(api_client, image_file())
    alice.refresh_from_db()
    first = alice.avatar.path

    upload(api_client, image_file())
    alice.refresh_from_db()
    assert alice.avatar.path != first
    assert len(list((media_root / 'avatars').iterdir())) == 1


def test_remove_avatar(api_client, alice, media_root):
    upload(api_client, image_file())
    response = api_client.delete(AVATAR)
    assert response.status_code == 200
    assert response.json()['avatar'] is None
    assert not list((media_root / 'avatars').iterdir())


def test_too_large_file_is_413(api_client, alice):
    big = SimpleUploadedFile('big.png', b'0' * (2 * 1024 * 1024 + 1))
    response = upload(api_client, big)
    assert response.status_code == 413
    assert error(response)['code'] == 'file_too_large'
    assert 'avatar' in error(response)['fields']


def test_fake_image_is_rejected(api_client, alice):
    response = upload(api_client, SimpleUploadedFile('virus.png', b'not an image at all'))
    assert response.status_code == 400
    assert 'avatar' in error(response)['fields']


def test_gif_is_not_allowed(api_client, alice):
    response = upload(api_client, image_file('anim.gif', 'GIF', mode='P'))
    assert response.status_code == 400


def test_missing_file_is_rejected(api_client, alice):
    assert api_client.put(AVATAR, {}, format='multipart').status_code == 400


@pytest.mark.django_db
def test_visitor_cannot_upload(api_client):
    assert upload(api_client, image_file()).status_code == 401
