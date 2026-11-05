# Spécification technique : ft_transcendence

> **Version :** 0.1 (brouillon, à valider en équipe)
> **Date :** 2026-11-05
> **Référence fonctionnelle :** [SPEC_FONC.md](SPEC_FONC.md) (v0.3)
> **Équipe :** pledieu, abouclie, aboumall, arocca

Ce document fixe **comment** on construit ce que décrit la spec fonctionnelle. La **partie commune** (§1 à §7) définit les contrats entre le front, le back, le temps réel et l'infra : on la valide à 4. Les **sections par partie** (§8 à §11) sont rédigées par leur responsable.

Les points marqués ⚠️ sont des **propositions à valider**.

---

## Partie commune

### 1. Architecture

```text
                        Navigateur (Chrome)
                               │ HTTPS / WSS (443)
                               ▼
                  ┌──────────────────────────┐
                  │  nginx (+ ModSecurity)   │  TLS, en-têtes de sécurité, rate limiting
                  └──┬──────────┬─────────┬──┘
           /          │  /api/   │  /ws/   │  /media/ (après contrôle du backend)
           ▼          ▼          ▼         ▼
     ┌──────────┐  ┌─────────────────────┐  ┌──────────────┐
     │ frontend │  │ backend (Django ASGI)│  │ volume media │
     │ React SPA│  │ DRF + Channels       │  └──────────────┘
     └──────────┘  └──┬───────────┬──────┘
                      ▼           ▼
                ┌──────────┐ ┌───────┐   ┌────────┐ ┌─────────┐
                │ Postgres │ │ Redis │   │ Mailpit│ │  Vault  │
                └──────────┘ └───────┘   └────────┘ └─────────┘
```

| Service | Image / techno | Rôle |
|---|---|---|
| `nginx` | nginx + ModSecurity | Point d'entrée unique en HTTPS (`TR7`), sert le front et les médias protégés |
| `frontend` | Node 22, Vite, React | SPA ; build statique servi par nginx en prod, serveur Vite en dev |
| `backend` | Python 3.12, Django, DRF, Channels, serveur ASGI (Daphne ou Uvicorn) | API REST et WebSocket dans le même process |
| `database` | Postgres 15+ | Données |
| `redis` | Redis 7 | Channel layer de Channels, présence en ligne, rate limiting |
| `mailpit` | Mailpit (dev) | Réception des emails de test |
| `vault` | HashiCorp Vault | Secrets (module `security.waf_vault`) |

**Routes publiques (via nginx) :**

| Préfixe | Destination |
|---|---|
| `/` | SPA (toute route inconnue renvoie `index.html`) |
| `/api/v1/` | API REST |
| `/api/schema/`, `/api/docs/` | OpenAPI (drf-spectacular), en dev seulement |
| `/ws/` | WebSocket |
| `/media/` | Fichiers, servis par nginx **après autorisation** du backend (`X-Accel-Redirect`, MEDIA-06) |

Une **seule origine** (même domaine pour le front, l'API et le WebSocket) : pas de CORS à gérer, et les cookies fonctionnent partout.

### 2. Authentification ⚠️

**Proposition : sessions Django par cookie**, plutôt que JWT.

- Cookie de session `HttpOnly`, `Secure`, `SameSite=Lax`, avec le cookie `csrftoken`. Le front renvoie l'en-tête `X-CSRFToken` sur toute requête qui modifie quelque chose.
- Le WebSocket s'authentifie avec le **même cookie** (`AuthMiddlewareStack` de Channels). Pas de token à passer dans l'URL.
- **Révocation immédiate** : bannir ou supprimer un compte supprime ses sessions en base et ferme ses sockets (ADM-04, ACC-09). Avec un JWT, il faudrait gérer une liste noire.
- Endpoints : `POST /api/v1/auth/register|login|logout`, `GET /api/v1/auth/me`, `GET /api/v1/auth/csrf`.
- Anti-bruteforce (5 échecs en 15 min) : compteur dans Redis par IP et par identifiant.
- 2FA et OAuth 42 (bonus) se branchent sur ce même système.

### 3. Conventions de l'API REST ⚠️

- **Préfixe** `/api/v1/`, ressources au pluriel : `/posts/`, `/users/{username}/`, `/posts/{id}/replies/`.
- **JSON en `snake_case`** de bout en bout. Le front garde les noms du backend.
- **Dates** en ISO 8601 UTC (`2026-11-05T14:30:00Z`). Le front les affiche en heure locale.
- **Identifiants** entiers. Les users sont adressés par `username` dans les URLs publiques.
- **Codes HTTP :**

| Code | Cas |
|---|---|
| 200 / 201 / 204 | Succès, création, succès sans contenu |
| 400 | Validation échouée |
| 401 | Non connecté (toute écriture d'un visiteur, VIS-06) |
| 403 | Connecté mais pas autorisé, ou banni |
| 404 | Inexistant **ou invisible** (on ne révèle pas l'existence d'un post privé) |
| 409 | Conflit (déjà liké, nom d'utilisateur pris…) |
| 413 | Fichier trop gros |
| 429 | Rate limiting |

- **Format d'erreur unique** (exception handler DRF personnalisé) :

```json
{
  "error": {
    "code": "validation_error",
    "message": "Certains champs sont invalides.",
    "fields": { "username": ["Ce nom d'utilisateur est déjà pris."] }
  }
}
```

- **Pagination :**
  - **par curseur** pour tout ce qui défile (fils, réponses, messages, notifications) : `{ "next": "<url|null>", "previous": "<url|null>", "results": [...] }` ;
  - **par numéro de page** pour l'admin et la recherche : `{ "count", "next", "previous", "results" }`.
- **Contrat :** le schéma OpenAPI généré par drf-spectacular fait foi. Le front en génère ses types et ses mocks.

### 4. Contrat temps réel ⚠️

- **Une seule connexion** WebSocket par onglet : `wss://<domaine>/ws/`.
- Tous les messages ont la même enveloppe :

```json
{ "type": "dm.message", "data": { ... } }
```

- Les types sont nommés `<domaine>.<événement>` : `dm.message`, `dm.typing`, `notif.new`, `presence.update`, `feed.new_posts`, `session.revoked`…
- La liste complète et le contenu de chaque type sont dans `docs/ws-events.md`, tenu par le membre WebSocket.
- Le WebSocket sert **à pousser**. Les actions (envoyer un message, liker…) passent par l'API REST, ce qui garde une seule couche de validation et de permissions.
- Reconnexion côté client avec délai croissant (1 s, 2 s, 4 s… jusqu'à 30 s), puis rechargement des données manquées par l'API.

### 5. Données et règles transverses

- Le modèle conceptuel est au §6 de la spec fonctionnelle. Sa traduction en modèles Django est en §8.
- Le **moteur de visibilité** (§3 de la spec fonctionnelle) est écrit **une seule fois**, côté backend, sous forme de querysets réutilisables (`Post.objects.visible_to(user)`). L'API, la recherche, les notifications et le WebSocket l'utilisent tous.
- **Concurrence (`GR7`)** : contraintes d'unicité en base, `transaction.atomic`, compteurs mis à jour avec `F()`. Aucune règle d'unicité vérifiée seulement en Python.

### 6. Médias

- Upload en `multipart/form-data` vers l'API, avant ou pendant la création du post.
- Le backend vérifie le **vrai type MIME** (lecture des premiers octets), la taille et, pour les vidéos, la durée (MEDIA-01 à 03).
- Les fichiers sont renommés (UUID) et stockés hors de la racine web.
- Lecture : `GET /media/<chemin>` → nginx demande l'autorisation au backend → `X-Accel-Redirect` si le demandeur peut voir le post.

### 7. Environnement, qualité, Git

- **Secrets** : `.env` (ignoré par Git) et `.env.example` à jour (`TR3`). Les secrets passent ensuite dans Vault.
- **Une commande** : `make` construit et lance tout (`GR3`).
- **Lint et format** : Ruff pour le backend, ESLint + Prettier pour le frontend.
- **Tests** : pytest + pytest-django pour le backend, Vitest + Testing Library pour le frontend. Ils tournent dans la CI GitHub Actions à chaque PR.
- **Git** (§11.3 de la spec fonctionnelle) : Conventional Commits en anglais, au moins 1 relecture par un autre membre, CI au vert avant le merge.
- **Branches d'intégration par partie :** une branche d'intégration par partie (ex. `frontend`), avec des sous-branches `<partie>/feat|fix|chore/<sujet>`. Merge vers `master` (ou `dev`) une fois par sprint.

---

## Sections par partie

### 8. Backend

> À compléter par le responsable backend.

- Découpage en apps Django : `accounts`, `social`, `posts`, `media`, `messaging`, `notifications`, `moderation`, `search`…
- Modèles, index et contraintes.
- Permissions DRF par rôle (visiteur, user, admin).
- Implémentation du moteur de visibilité.
- Rate limiting de la lecture anonyme (VIS-06).

### 9. Temps réel

> À compléter par le responsable WebSocket.

- Consumers Channels et groupes (`user_<id>`, `conversation_<id>`).
- Gestion de la présence (compteur de connexions par user dans Redis).
- Fermeture des sockets au bannissement et à la déconnexion.
- `docs/ws-events.md`.

### 10. DevOps / sécurité

> À compléter par le responsable DevOps.

- Docker Compose (services, healthchecks, volumes, réseaux).
- Certificats TLS en dev.
- Règles ModSecurity (OWASP CRS).
- Vault : quels secrets, comment Django les lit.
- En-têtes de sécurité (CSP, HSTS…).

### 11. Frontend

> Responsable : aboumall. Plan détaillé par sprint : `docs/FRONT_PLAN.md`.

#### 11.1 Stack

| Besoin | Choix | Pourquoi |
|---|---|---|
| Langage | **TypeScript** ⚠️ | Types générés depuis l'OpenAPI, moins de bugs d'intégration |
| Build | Vite | Déjà en place |
| Runtime | Node 22 (`node:22-alpine`) | Node 18 n'est plus maintenu |
| Routing | React Router | Routes imbriquées (profil, paramètres, admin) |
| Données serveur | **TanStack Query** + client `fetch` maison | Cache, défilement infini, états de chargement |
| État global | Context React (session, socket) | Le reste vient du cache de TanStack Query |
| Formulaires | React Hook Form + Zod | Validation côté front (`TR6`), mêmes règles que le back |
| Style | **Tailwind CSS** (`TR1`/`TR2`) | Les tokens du design system sont dans le thème Tailwind |
| Icônes | Lucide | Libre, cohérent |
| Mocks | MSW | Coder avant que l'API existe |
| Types API | `openapi-typescript` | Généré depuis `/api/schema/` |
| Tests | Vitest + Testing Library | Composants du design system et formulaires |

#### 11.2 Arborescence

```text
frontend/src/
├── app/            # routes, layouts, providers (Query, Auth, Socket)
├── design-system/  # tokens + composants réutilisables (module web.design_system)
├── features/       # un dossier par domaine : auth, posts, profile, social, dm, notifs, search, admin, legal
│   └── posts/
│       ├── api.ts          # hooks TanStack Query (usePost, useCreatePost…)
│       ├── components/     # composants propres au domaine
│       └── routes.tsx      # pages du domaine
├── lib/            # client API, client WebSocket, utilitaires
├── mocks/          # handlers MSW
└── pages/          # 404, erreur, pages légales
```

Règle : un domaine de `features/` peut importer `design-system/` et `lib/`, mais jamais un autre domaine directement.

#### 11.3 Client API

- Un seul module `lib/api.ts` : préfixe `/api/v1`, `credentials: "include"`, ajout de `X-CSRFToken`, conversion du format d'erreur (§3) en exception typée.
- Une réponse 401 vide la session locale et ouvre la fenêtre de connexion (VIS-03).
- Les formulaires affichent les `fields` renvoyés par le backend sous les champs concernés.

#### 11.4 Temps réel

- Un hook `useSocket()` fourni par un provider : une connexion par onglet, ouverte seulement si l'user est connecté.
- Chaque domaine s'abonne aux types qui le concernent et met à jour le cache de TanStack Query (ex. `notif.new` incrémente le compteur de la cloche).

#### 11.5 Design system

- **Tokens** : couleurs (1 primaire, gris, succès, erreur, avertissement, en clair et en sombre), typo, espacements, rayons, ombres, dans le thème Tailwind.
- **Composants** (≥ 10, module `web.design_system`) : `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast`, `Tabs`, `Dropdown`, `EmptyState`, `Skeleton`, `UserListItem`, `PostCard`, `MediaGrid`, `ProgressBar`.
- **Documentation** : page `/design-system` dans la SPA, qui montre chaque composant, ses variantes et ses props.
- Maquettes de référence : Framer.

#### 11.6 Qualité

- Console Chrome sans erreur ni warning (`GR5`) : vérifiée dans la Definition of Done.
- Responsive : mobile d'abord, avec les breakpoints de Tailwind (`sm`, `md`, `lg`).
- Accessibilité de base : labels de formulaires, focus visible, contrastes WCAG AA.

---

## 12. Points à valider en équipe

1. Sessions par cookie plutôt que JWT (§2).
2. Format d'erreur et pagination (§3).
3. Enveloppe des événements WebSocket ; actions par REST uniquement (§4).
4. Serveur de médias protégé par `X-Accel-Redirect` (§6).
5. TypeScript pour le frontend (§11.1).
