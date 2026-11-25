import json

from channels.generic.websocket import AsyncWebsocketConsumer

from ..presence import (
    mark_user_connected,
    mark_user_disconnected,
    notify_presence_change,
    refresh_user_presence,
)


class BaseWebsocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        """Authentifie l'utilisateur via la session, rejoint son groupe et accepte la connexion."""
        self.user = None
        self.user_group_name = None
        self._joined_user_group = False

        user = self.scope.get('user')

        if user is None or not getattr(user, 'is_authenticated', False):
            await self.close(code=4001)
            return

        if getattr(user, 'is_banned', False):
            await self.close(code=4003)
            return

        self.user = user
        self.user_group_name = f'user_{user.id}'

        await self.accept()

        if self.channel_layer is not None:
            await self.channel_layer.group_add(self.user_group_name, self.channel_name)
            self._joined_user_group = True

        await self.send_event('connection.established', {'status': 'ok'})

        if await mark_user_connected(self.user.id):
            await notify_presence_change(user_id=self.user.id, is_online=True)

    async def disconnect(self, code: int):
        """Nettoie l'appartenance au groupe utilisateur lors de la fermeture du WebSocket."""
        joined = getattr(self, '_joined_user_group', False)
        has_group_name = getattr(self, 'user_group_name', None)

        if joined and has_group_name and self.channel_layer is not None:
            await self.channel_layer.group_discard(has_group_name, self.channel_name)
            self._joined_user_group = False

        if self.user is not None and self.user.id is not None:
            if await mark_user_disconnected(self.user.id):
                await notify_presence_change(user_id=self.user.id, is_online=False)

    async def ws_event(self, event: dict):
        """
        Reçoit un message envoyé via channel_layer.group_send()
        et le transmet au client avec un format normalisé.
        """
        await self.send_event(event_type=event['event_type'], data=event.get('data'))

    async def send_event(self, event_type: str, data=None):
        """Envoie un événement JSON normalisé au client connecté."""
        await self.send(
            text_data=json.dumps(
                {
                    'type': event_type,
                    'data': data if data is not None else {},
                }
            )
        )

    async def send_error(self, message: str, code: str = 'invalid_data'):
        """Envoie une erreur JSON standardisée."""
        await self.send_event(
            'error',
            {
                'code': code,
                'message': message,
            },
        )

    async def parse_json(self, text_data: str | None) -> dict | None:
        """Parse le texte reçu en dict JSON, ou envoie une erreur si invalide."""
        if not text_data:
            await self.send_error('Empty message.', code='empty_message')
            return None

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error('Invalid JSON.', code='invalid_json')
            return None

        if not isinstance(data, dict):
            await self.send_error(
                'Invalid format (message must be a JSON object).', code='invalid_format'
            )
            return None

        return data

    async def receive(self, text_data=None, bytes_data=None):
        data = await self.parse_json(text_data)
        if data is None:
            return

        event_type = data.get('type')
        if event_type == 'ping':
            if self.user is not None and self.user.id is not None:
                await refresh_user_presence(self.user.id)
                await self.send_event('pong')
        else:
            await self.send_error(
                f'Unknown message event_type: {event_type}',
                code='unknown_event_type',
            )
        return
