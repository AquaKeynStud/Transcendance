import pytest
from django.db import IntegrityError, transaction
from django.utils import timezone

from posts.models import Like, Post, Repost


@pytest.fixture
def alice(make_user):
    return make_user('alice')


@pytest.fixture
def post(alice):
    return Post.objects.create(author=alice, title='Hello')


def test_post_requires_a_title(alice):
    with pytest.raises(IntegrityError), transaction.atomic():
        Post.objects.create(author=alice, content='No title')


def test_reply_cannot_have_a_title(alice, post):
    with pytest.raises(IntegrityError), transaction.atomic():
        Post.objects.create(author=alice, is_reply=True, parent=post, title='Nope')


def test_only_replies_have_a_parent(alice, post):
    with pytest.raises(IntegrityError), transaction.atomic():
        Post.objects.create(author=alice, parent=post, title='Not a reply')


def test_soft_deleted_post_can_lose_its_title(post):
    post.title = ''
    post.content = ''
    post.deleted_at = timezone.now()
    post.save()
    assert post.is_deleted


def test_admin_deletion_implies_deletion(post):
    post.deleted_by_admin = True
    with pytest.raises(IntegrityError), transaction.atomic():
        post.save()


def test_replies_survive_when_the_parent_author_deletes_their_account(make_user, alice, post):
    bob = make_user('bob')
    reply = Post.objects.create(author=bob, is_reply=True, parent=post, content='Hi')
    alice.delete()
    reply.refresh_from_db()
    assert reply.is_reply
    assert reply.parent is None


def test_one_like_per_user_and_post(make_user, post):
    bob = make_user('bob')
    Like.objects.create(user=bob, post=post)
    with pytest.raises(IntegrityError), transaction.atomic():
        Like.objects.create(user=bob, post=post)


def test_one_repost_per_user_and_post(make_user, post):
    bob = make_user('bob')
    Repost.objects.create(user=bob, post=post)
    with pytest.raises(IntegrityError), transaction.atomic():
        Repost.objects.create(user=bob, post=post)
