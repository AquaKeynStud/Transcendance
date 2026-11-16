from moderation.models import ModerationLog


def test_log_survives_the_deletion_of_its_target(make_user):
    admin, bob = make_user('admin'), make_user('bob')
    log = ModerationLog.objects.create(
        admin=admin,
        action=ModerationLog.Action.DELETE_USER,
        target_user=bob,
        target_username=bob.username,
        reason='Spam',
    )
    bob.delete()
    log.refresh_from_db()
    assert log.target_user is None
    assert log.target_username == 'bob'
