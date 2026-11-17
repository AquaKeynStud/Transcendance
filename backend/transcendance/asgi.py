"""
ASGI config for transcendance project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# 1. On configure l'environnement Django de base
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'transcendance.settings')
django_asgi_app = get_asgi_application()

# 2. Le chef d'orchestre (ProtocolTypeRouter)
application = ProtocolTypeRouter({
    # Si le trafic entrant est du HTTP (pages web, API REST DRF...)
    # -> On l'envoie vers le Django classique.
    "http": django_asgi_app,

    # Si le trafic entrant est un WebSocket (ws:// ou wss://)
    # -> On l'envoie vers la pile de gestion des WebSockets de Channels.
    "websocket": AuthMiddlewareStack(
        URLRouter(
            # C'est ici qu'on mettra plus tard la liste de tes routes de WebSockets 
            # (ex: ws/chat/, ws/game/, etc.)
            []
        )
    ),
})