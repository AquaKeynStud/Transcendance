import json
from channels.generic.websocket import AsyncWebsocketConsumer


class BaseWebsocketConsumer(AsyncWebsocketConsumer):
    async def send_event(self, event_type: str, payload=None):
        """Envoie un événement JSON normalisé au client connecté."""
        await self.send(
            text_data=json.dumps({
                "type": event_type,
                "payload": payload if payload is not None else {},
            })
        )

    async def send_error(self, message: str, code: str = "invalid_payload"):
        """Envoie une erreur JSON standardisée."""
        await self.send_event(
            "error",
            {
                "code": code,
                "message": message,
            },
        )

    async def parse_json(self, text_data: str | None) -> dict | None:
        """Parse le texte reçu en dict JSON, ou envoie une erreur si invalide."""
        if not text_data:
            await self.send_error("Empty message.", code="empty_message")
            return None

        try:
            data = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send_error("Invalid JSON.", code="invalid_json")
            return None

        if not isinstance(data, dict):
            await self.send_error("Invalid format (message must be a JSON object).", code="invalid_format")
            return None

        return data
