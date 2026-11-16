from django.conf import settings
from django.db import models
from django.db.models import Q


class Post(models.Model):
    """
    A post or a reply (SPEC_FONC §4.4).

    - A post has a title; a reply has none and points to its parent.
    - `is_reply` is stored on its own because `parent` becomes NULL when the parent's
      author deletes their account: the reply stays and shows "replying to an
      unavailable post" (SPEC_FONC §4.2.1).
    - Deleting a post is a soft delete: `deleted_at` is set and the content is
      wiped, but the row stays so the thread keeps its shape (SPEC_FONC §4.4.1).

    Length rules (title 3-120 chars, text or media required on replies) are checked
    by the API serializers; the database only guards the shape of the data.
    """

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='posts'
    )
    is_reply = models.BooleanField(default=False)
    parent = models.ForeignKey(
        'self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies'
    )
    title = models.CharField(max_length=120, blank=True)
    content = models.CharField(max_length=500, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True, blank=True)
    deleted_at = models.DateTimeField(null=True, blank=True)
    deleted_by_admin = models.BooleanField(default=False)

    class Meta:
        constraints = [
            # Only replies can have a parent.
            models.CheckConstraint(
                condition=Q(is_reply=True) | Q(parent__isnull=True),
                name='posts_post_parent_only_on_replies',
            ),
            # Replies never have a title.
            models.CheckConstraint(
                condition=Q(is_reply=False) | Q(title=''),
                name='posts_post_reply_without_title',
            ),
            # A live post always has a title (a deleted one has been wiped).
            models.CheckConstraint(
                condition=Q(is_reply=True) | Q(deleted_at__isnull=False) | ~Q(title=''),
                name='posts_post_title_required',
            ),
            # Deleted by an admin implies deleted.
            models.CheckConstraint(
                condition=Q(deleted_by_admin=False) | Q(deleted_at__isnull=False),
                name='posts_post_admin_delete_is_delete',
            ),
        ]
        indexes = [
            # Profile tabs: a user's posts / replies, newest first
            models.Index(fields=['author', '-created_at'], name='posts_post_author_idx'),
            # Post page: replies of a post, oldest first
            models.Index(fields=['parent', 'created_at'], name='posts_post_parent_idx'),
            # Explore feed: recent posts
            models.Index(fields=['-created_at'], name='posts_post_created_idx'),
        ]

    def __str__(self):
        if self.deleted_at:
            return f'#{self.pk} (deleted)'
        return f'#{self.pk} {self.title or self.content[:40]}'

    @property
    def is_deleted(self):
        return self.deleted_at is not None


class Mention(models.Model):
    """`user` is mentioned with @username in `post` (POST-05)."""

    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='mentions')
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mentions'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['post', 'user'], name='posts_mention_unique'),
        ]

    def __str__(self):
        return f'@{self.user} in #{self.post_id}'


class Like(models.Model):
    """One like per user and per post (LIKE-01)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='likes'
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='posts_like_unique'),
        ]
        indexes = [
            # "Liked by" list of a post
            models.Index(fields=['post', '-created_at'], name='posts_like_post_idx'),
            # "Likes" tab of a profile
            models.Index(fields=['user', '-created_at'], name='posts_like_user_idx'),
        ]

    def __str__(self):
        return f'{self.user} likes #{self.post_id}'


class Repost(models.Model):
    """One repost per user and per post (REPOST-01)."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reposts'
    )
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='reposts')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['user', 'post'], name='posts_repost_unique'),
        ]
        indexes = [
            models.Index(fields=['post', '-created_at'], name='posts_repost_post_idx'),
            # "Reposts" tab of a profile, and reposts in the following feed
            models.Index(fields=['user', '-created_at'], name='posts_repost_user_idx'),
        ]

    def __str__(self):
        return f'{self.user} reposted #{self.post_id}'
