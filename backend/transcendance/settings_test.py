"""
Settings used by pytest (see pyproject.toml).

Tests must run without a .env, so a throwaway key is provided before the regular
settings are loaded. A real DJANGO_SECRET_KEY from the environment still wins.
"""

import os

os.environ.setdefault('DJANGO_SECRET_KEY', 'test-secret-key-not-for-production')

from .settings import *  # noqa: E402, F403

# Hashing passwords properly is slow on purpose; tests don't need that.
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']
