# Contrat des événements WebSocket

> Version de travail (v0.1) — à ajuster avec l'équipe au fur et à mesure de la validation des modèles et des endpoints.

# 1. Principes généraux

- **Connexion unique** : une connexion WebSocket par onglet (ex. `wss://<domaine>/ws/`).
- **Rôle du WebSocket** : pousser les événements en temps réel du serveur vers le client. Les actions métier (envoi d'un message, like, etc.) passent par l'API REST.
- **Authentification** : assurée via la session Django (`AuthMiddlewareStack`). Les connexions non authentifiées ou d'utilisateurs bannis sont refusées.
- **Dates** : format ISO 8601 UTC (`YYYY-MM-DDTHH:MM:SSZ`).

# 2. Enveloppe commune

Chaque message JSON suit la même structure :

```json
{
  "type": "<domaine>.<événement>",
  "data": {}
}
```

- `type` : identifiant de l'événement (ex. `presence.update`, `notif.new`, `error`).
- `data` : objet contenant les informations propres à l'événement (`{}` si aucune donnée n'est nécessaire).

# 3. Événements système et session

### `error`

- **Sens**: Serveur -> Client
- **Déclencheur**: le client envoie un message vide, un JSON invalide ou un format inattendu.
- **Exemple**:

```json
{
  "type": "error",
  "data": {
    "code": "invalid_json",
    "message": "Invalid JSON."
  }
}
```

### `session.revoked`

- **Sens**: Serveur -> Client
- **Déclencheur**: un utilisateur est banni, déconnecté de force ou son compte est supprimé.
- **Destinataires**: toutes les connexions actives de l'utilisateur (user_<id>).
- **Exemple**:
```json
{
  "type": "session.revoked",
  "data": {
    "reason": "banned"
  }
}
```

# 4. Connection (`connection.*`)

### `connection.established`

- **Sens**: Serveur -> Client
- **Déclencheur**: la connexion WebSocket est acceptée par le serveur.
- **Destinataires**: le client qui vient d'ouvrir la connexion.
- **Exemple**:
```json
{
  "type": "connection.established",
  "data": {
    "status": "ok"
  }
}
```

### `ping`

- **Sens**: Client -> Server
- **Déclencheur**: envoi périodique par le client pour maintenir sa présence active
- **Destinataires**: serveur
- **Exemple**:
```json
{
  "type": "ping",
  "data": {}
}
```

### `pong`

- **Sens**: Serveur -> Client
- **Déclencheur**: réception d'un événement `ping` valide par le serveur; rafraîchit également le TTL de présence dans Redis.
- **Destinataires**: le client ayant envoyé le `ping`.
- **Exemple**:
```json
{
  "type": "pong",
  "data": {}
}
```


# 5. Présence (`presence.*`)

### `presence.update`

- **Sens**: Serveur -> Client
- **Déclencheur**: le statut en ligne d'un utilisateur change (passage de 0 à 1 connexion active, ou retour de 1 à 0).
- **Destinataires**: utilisateurs autorisés à voir le statut en ligne (amis / conversations selon les règles de visibilité).
- **Exemple**:
```json
{
  "type": "presence.update",
  "data": {
    "user_id": 7,
    "is_online": true
  }
}
```
