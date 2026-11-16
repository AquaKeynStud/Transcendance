from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from accounts.models import User
from posts.models import Like, Mention, Post, Repost
from social.models import Follow

ACCEPTED = Follow.Status.ACCEPTED
PENDING = Follow.Status.PENDING


class Command(BaseCommand):
    help = 'Fill the database with development data (DEBUG only).'

    def add_arguments(self, parser):
        parser.add_argument(
            '--password',
            default='password123',
            help='Password given to every seeded account (default: password123).',
        )

    @transaction.atomic
    def handle(self, *args, password, **options):
        if not settings.DEBUG:
            raise CommandError('seed only runs with DJANGO_DEBUG=1.')
        if User.objects.filter(username='alice').exists():
            self.stdout.write('Database already seeded, nothing to do.')
            return

        User.objects.create_superuser('admin', 'admin@example.com', password)
        alice = User.objects.create_user(
            'alice', 'alice@example.com', password, display_name='Alice', bio='Public account.'
        )
        bob = User.objects.create_user(
            'bob',
            'bob@example.com',
            password,
            display_name='Bob',
            is_private=True,
            bio='Private account.',
        )
        charlie = User.objects.create_user(
            'charlie',
            'charlie@example.com',
            password,
            display_name='Charlie',
            likes_visibility=User.Visibility.FOLLOWERS,
        )

        # alice and bob are friends (mutual follow); charlie waits for bob's approval.
        Follow.objects.bulk_create(
            [
                Follow(follower=alice, followed=bob, status=ACCEPTED),
                Follow(follower=bob, followed=alice, status=ACCEPTED),
                Follow(follower=charlie, followed=alice, status=ACCEPTED),
                Follow(follower=charlie, followed=bob, status=PENDING),
            ]
        )

        hello = Post.objects.create(
            author=alice, title='Hello world', content='First post on the platform!'
        )
        Post.objects.create(author=alice, title='A post without text')
        secret = Post.objects.create(
            author=bob, title='Only my followers see this', content='bob is private.'
        )
        reply = Post.objects.create(
            author=charlie, is_reply=True, parent=hello, content='Welcome @alice!'
        )
        Mention.objects.create(post=reply, user=alice)
        Post.objects.create(author=alice, is_reply=True, parent=reply, content='Thanks!')
        Post.objects.create(author=alice, is_reply=True, parent=secret, content='Nice one.')

        Like.objects.bulk_create(
            [
                Like(user=bob, post=hello),
                Like(user=charlie, post=hello),
                Like(user=alice, post=secret),
            ]
        )
        Repost.objects.create(user=charlie, post=hello)

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeded admin, alice, bob (private) and charlie. Password: {password}'
            )
        )
