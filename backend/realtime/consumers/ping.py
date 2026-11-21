from .base import BaseWebsocketConsumer


class PingConsumer(BaseWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.send_event("connection.established", {"status": "ok"})

    async def receive(self, text_data=None, bytes_data=None):
        data = await self.parse_json(text_data)
        if data is None:
            return

        msg_type = data.get("type")
        if msg_type == "ping":
            await self.send_event("pong", {"echo": data.get("payload")})
        else:
            await self.send_error(
                f"Type de message non géré : {msg_type}",
                code="unknown_event_type",
            )

    async def disconnect(self, close_code):
        pass
