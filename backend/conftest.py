import pytest
from rest_framework.test import APIClient


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def make_user(db, django_user_model):
    """Create a user; only the username is required."""

    def make(username, **fields):
        fields.setdefault('email', f'{username}@example.com')
        fields.setdefault('password', 'password123')
        return django_user_model.objects.create_user(username=username, **fields)

    return make
