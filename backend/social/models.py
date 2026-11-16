from django.conf import settings
from django.db import models


class Follow(models.Model):
    """
    `follower` follows `followed` (SPEC_FONC §4.3).

    Following a public account is accepted immediately; following a private one
    creates a pending request. Friends are mutual accepted follows (SOC-06).
    """

    class Status(models.TextChoices):
        PENDING = 'pending'
        ACCEPTED = 'accepted'

    follower = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='outgoing_follows'
    )
    followed = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='incoming_follows'
    )
    # Pending by default: a forgotten status must never leak a private account.
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            # Enforced by the database, not only in Python, to avoid race conditions (GR7).
            models.UniqueConstraint(fields=['follower', 'followed'], name='social_follow_unique'),
            models.CheckConstraint(
                condition=~models.Q(follower=models.F('followed')),
                name='social_follow_not_self',
            ),
            models.CheckConstraint(
                condition=models.Q(status__in=['pending', 'accepted']),
                name='social_follow_status_valid',
            ),
        ]
        indexes = [
            # "Who follows me" and "my pending requests"
            models.Index(fields=['followed', 'status'], name='social_follow_followed_idx'),
            # "Who do I follow" (feed, visibility checks)
            models.Index(fields=['follower', 'status'], name='social_follow_follower_idx'),
        ]

    def __str__(self):
        return f'{self.follower} -> {self.followed} ({self.status})'
