import pytest
from django.db import IntegrityError, transaction

from social.models import Follow


def test_follow_is_pending_by_default(make_user):
    follow = Follow.objects.create(follower=make_user('alice'), followed=make_user('bob'))
    assert follow.status == Follow.Status.PENDING


def test_cannot_follow_twice(make_user):
    alice, bob = make_user('alice'), make_user('bob')
    Follow.objects.create(follower=alice, followed=bob)
    with pytest.raises(IntegrityError), transaction.atomic():
        Follow.objects.create(follower=alice, followed=bob)


def test_cannot_follow_yourself(make_user):
    alice = make_user('alice')
    with pytest.raises(IntegrityError), transaction.atomic():
        Follow.objects.create(follower=alice, followed=alice)


def test_follows_disappear_with_the_account(make_user):
    alice, bob = make_user('alice'), make_user('bob')
    Follow.objects.create(follower=alice, followed=bob)
    Follow.objects.create(follower=bob, followed=alice)
    alice.delete()
    assert not Follow.objects.exists()
