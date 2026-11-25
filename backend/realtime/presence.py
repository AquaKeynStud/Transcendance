import redis.asyncio as aioredis
from asgiref.sync import sync_to_async
from channels.layers import get_channel_layer

from social.models import Follow

PRESENCE_TTL_SECONDS = 120
_redis_client: aioredis.Redis | None = None


def _get_redis_client() -> aioredis.Redis:
    """Retourne un client Redis async partagé au niveau du module."""
    global _redis_client
    if _redis_client is None:
        _redis_client = aioredis.from_url('redis://redis:6379/0', decode_responses=True)
    return _redis_client


def _presence_key(user_id: int) -> str:
    return f'ws:presence:user:{user_id}'


async def mark_user_connected(user_id: int) -> bool:
    """
    Incrémente le compteur de connexions actives de l'utilisateur.
    Retourne True uniquement lors de la premiere connection.
    """
    client = _get_redis_client()
    key = _presence_key(user_id)
    count = await client.incr(key)
    await client.expire(key, PRESENCE_TTL_SECONDS)
    return count == 1


async def mark_user_disconnected(user_id: int) -> bool:
    """
    Décrémente le compteur de connexions actives de l'utilisateur.
    Retourne True uniquement lors de la transition vers 0 (vient de passer hors ligne).
    """
    client = _get_redis_client()
    key = _presence_key(user_id)
    count = await client.decr(key)
    if count <= 0:
        await client.delete(key)
    return count <= 0


async def refresh_user_presence(user_id: int) -> None:
    """
    Rafraîchit le TTL de présence uniquement si l'utilisateur a au moins une connexion active.
    """
    client = _get_redis_client()
    key = _presence_key(user_id)
    if await client.exists(key):
        await client.expire(key, PRESENCE_TTL_SECONDS)


async def is_user_online(user_id: int) -> bool:
    """Indique si l'utilisateur a actuellement au moins une connexion WebSocket."""
    client = _get_redis_client()
    key = _presence_key(user_id)
    value = await client.get(key)
    return value is not None and int(value) > 0


def _get_mutual_friend_ids_sync(user_id: int) -> list[int]:
    following_ids = Follow.objects.filter(
        follower_id=user_id,
        status=Follow.Status.ACCEPTED,
    ).values_list('followed_id', flat=True)

    mutual_ids = (
        Follow.objects.filter(
            follower_id__in=following_ids,
            followed_id=user_id,
            status=Follow.Status.ACCEPTED,
        )
        .values_list('follower_id', flat=True)
        .distinct()
    )

    return list(mutual_ids)


async def get_friend_ids(user_id: int) -> list[int]:
    """Retourne la liste des IDs des amis (abonnements mutuels acceptés) de user_id."""
    return await sync_to_async(_get_mutual_friend_ids_sync, thread_sensitive=True)(user_id)


async def notify_presence_change(user_id: int, is_online: bool) -> None:
    """Envoie l'event presence.update aux amis de user_id via le channel_layer"""
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return

    friend_ids = await get_friend_ids(user_id)
    if not friend_ids:
        return

    event_data = {
        'type': 'ws_event',
        'event_type': 'presence.update',
        'data': {'user_id': user_id, 'is_online': is_online},
    }

    for friend_id in friend_ids:
        channel_layer.group_send(f'user_{friend_id}', event_data)

    return
