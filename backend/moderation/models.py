from django.conf import settings
from django.db import models


class ModerationLog(models.Model):
    """
    Who did what, to whom, when and why (ADM-08).

    Foreign keys are SET_NULL so the history survives account and post deletions;
    `target_username` keeps a readable trace once the target account is gone.
    """

    class Action(models.TextChoices):
        BAN = 'ban'
        UNBAN = 'unban'
        DELETE_USER = 'delete_user'
        DELETE_POST = 'delete_post'
        EDIT_PROFILE = 'edit_profile'
        PROMOTE = 'promote'
        DEMOTE = 'demote'

    admin = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='moderation_actions',
    )
    action = models.CharField(max_length=20, choices=Action.choices)
    target_user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_entries',
    )
    target_username = models.CharField(max_length=20, blank=True)
    target_post = models.ForeignKey(
        'posts.Post',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='moderation_entries',
    )
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['-created_at'], name='moderation_log_created_idx'),
        ]

    def __str__(self):
        return f'{self.created_at:%Y-%m-%d %H:%M} {self.admin} {self.action} {self.target_username}'
