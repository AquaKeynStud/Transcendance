# Plan du frontend : ft_transcendence

> **Référence :** [SPEC_FONC.md](SPEC_FONC.md) (v0.3), §7 (écrans), §10.2 (lot Frontend), §11.5 (planning).
> **Période :** 2 nov. 2026 → 15 janv. 2027, sprints d'une semaine (lundi → dimanche).
> **Charge estimée :** environ 38 j-p.

---

## 1. Spec technique

Les choix techniques du front (stack, arborescence, client API, design system) sont dans [SPEC_TECH.md](SPEC_TECH.md), §11. Les contrats communs (auth, API, WebSocket) sont dans les §1 à §7.

---

## 2. Stratégie de branches

```text
master ─────────────●───────────────●──────────   (1 merge par sprint, toujours démontrable)
                    ↑               ↑
frontend ──●──●──●──●──●──●──●──●──●──────────   (intégration du front, PR obligatoire)
            ↑     ↑        ↑
  front/feat/design-tokens   front/feat/auth-pages   front/fix/navbar-overflow ...
```

- **`frontend`** : branche d'intégration du front, créée depuis `master`.
- **Sous-branches**, créées depuis `frontend` et mergées dans `frontend` par PR :
  - `front/feat/<sujet>` : nouvelle fonctionnalité ;
  - `front/fix/<sujet>` : correction ;
  - `front/chore/<sujet>` : setup, config, dépendances, doc.
- La branche d'intégration s'appelle `frontend` et pas `front`, parce que Git ne permet pas d'avoir à la fois une branche `front` et des branches `front/...`.
- En fin de sprint : PR `frontend` → `master`, ou vers `dev` quand cette branche existera (§11.3 de la spec).
- Commits en Conventional Commits, en anglais : `feat(auth): add login form validation`.
- Un ticket = une branche = une PR. Au maximum 2 tickets en cours par personne.

---

## 3. Plan par sprint

Les tâches marquées 🟨 sont prévues pour le membre WebSocket dans la spec (§10.2). Elles sont listées ici pour l'intégration.

### S1 : 2 → 8 nov. · « On sait quoi faire, le socle tourne »

| Branche | Contenu |
|---|---|
| `front/chore/tech-spec` | Faire valider [SPEC_TECH.md](SPEC_TECH.md) par l'équipe, puis l'ajuster |
| `front/chore/mockups` | Maquettes Framer : tokens, composants de base, écrans clés (fil, post, profil, messages, paramètres, admin, fil sur mobile) |
| `front/chore/setup` | Node 22, TypeScript, Tailwind, ESLint/Prettier, React Router, TanStack Query, MSW, arborescence, layout vide (navbar, contenu, footer) |

**Fin de sprint :** `make` lance le front, la navigation entre des pages vides marche et la console est propre.

### S2 : 9 → 15 nov. · « Je m'inscris et je me connecte »

| Branche | Contenu |
|---|---|
| `front/feat/design-tokens` | Palette, typo, espacements et rayons dans le thème Tailwind |
| `front/feat/ds-base-components` | `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast` |
| `front/feat/ds-showcase` | Page `/design-system` qui documente chaque composant et ses variantes |
| `front/feat/api-client` | Client API (erreurs, CSRF/auth), types générés depuis l'OpenAPI v1 |
| `front/feat/auth-pages` | Connexion, inscription, mot de passe oublié, nouveau mot de passe, vérification de l'email (AUTH-01 à 05), validation Zod |
| `front/feat/auth-guard` | Session, routes protégées, retour vers la page d'origine après connexion |

### S3 : 16 → 22 nov. · « J'ai un profil et je suis des gens »

| Branche | Contenu |
|---|---|
| `front/feat/profile-page` | En-tête du profil, compteurs, badge « privé », onglets vides (ACC-01, ACC-02) |
| `front/feat/settings` | Paramètres : Profil, Compte, Confidentialité, Sécurité (ACC-03 à 06), recadrage de l'avatar |
| `front/feat/follow` | Bouton S'abonner / Demandé / Abonné, page des demandes reçues (SOC-01 à 05) |
| `front/feat/social-lists` | Listes Abonnés · Abonnements · Amis (SOC-06), composant `UserListItem` |
| `front/feat/ds-tabs-dropdown` | `Tabs`, `Dropdown`, `EmptyState`, `Skeleton` |

### S4 : 23 → 29 nov. · « Je poste et je vois un fil »

| Branche | Contenu |
|---|---|
| `front/feat/post-card` | `PostCard` : compteurs, « (modifié) », « Post supprimé », menu d'actions (POST-06, POST-08) |
| `front/feat/composer` | Rédaction d'un post (500 caractères, compteur, au moins du texte ou un média) (POST-01) |
| `front/feat/feeds` | Fil Abonnements et fil Explorer, défilement infini (FEED-01, FEED-02) |
| `front/feat/post-edit-delete` | Modifier et supprimer son post, confirmation, toasts (POST-06, POST-07, NOTIF-03) |

### S5 : 30 nov. → 6 déc. · « Les conversations prennent forme »

| Branche | Contenu |
|---|---|
| `front/feat/post-thread` | Page d'un post : parents, post, réponses paginées (POST-03, POST-04) |
| `front/feat/mentions` | Liens `@username` dans le texte (POST-05) |
| `front/feat/media-upload` | Sélection, validation, aperçu, retrait, barre de progression (MEDIA-01 à 05) |
| `front/feat/media-display` | `MediaGrid`, GIF, lecteur vidéo, plein écran (MEDIA-08) |
| 🟨 `front/feat/dm-ui` | Boîte de réception, demandes, conversation (DM-01 à 05) |

### S6 : 7 → 13 déc. · « Le réseau est vivant »

| Branche | Contenu |
|---|---|
| `front/feat/likes-reposts` | Boutons like et republication, listes de comptes, interdiction sur les comptes privés (LIKE, REPOST) |
| `front/feat/profile-tabs` | Onglets Posts · Réponses · Médias · J'aime · Republications remplis (ACC-02) |
| `front/feat/online-status` | Point vert sur `Avatar` (ACC-07) |
| 🟨 `front/feat/notifications-ui` | Cloche, page Notifications, toasts temps réel (NOTIF-01, NOTIF-02) |

### S7 : 14 → 20 déc. · « C'est modéré et on trouve tout »

| Branche | Contenu |
|---|---|
| `front/feat/admin-users` | Liste des users (recherche, filtres, pagination) et fiche user (ADM-01, ADM-02) |
| `front/feat/admin-actions` | Modifier, bannir avec motif, supprimer, changer le rôle, supprimer un post (ADM-03 à 07) |
| `front/feat/admin-log` | Journal de modération (ADM-08) |
| `front/feat/search` | Recherche users et posts, filtres, tri, pagination (SEARCH-01 à 05) |

**Jalon du 20 déc. :** toutes les features des 14 points sont prêtes.

### S8 : 21 → 27 déc. *(fêtes)* · « Conforme au sujet »

| Branche | Contenu |
|---|---|
| `front/feat/legal-pages` | Politique de confidentialité et CGU réelles, liens dans le footer (UI-01 à 03) |
| `front/feat/guest-access` | Bandeau visiteur, fenêtre « Connectez-vous », masquage des actions (VIS-01 à 05) |
| `front/feat/account-data` | Exporter ses données, supprimer son compte (ACC-08, ACC-09) |
| `front/fix/responsive` | Passe mobile et tablette sur tous les écrans (UI-04) |

### S9 : 28 déc. → 3 janv. *(fêtes)* · « Solide »

| Branche | Contenu |
|---|---|
| `front/fix/console-clean` | Zéro erreur et zéro warning dans la console de Chrome (UI-05) |
| `front/feat/error-states` | 404, erreur générique, états de chargement et états vides partout (UI-06) |
| `front/chore/ds-docs` | Finaliser la page `/design-system` : au moins 10 composants documentés (UI-07) |

**Jalon du 3 janv. :** gel des features.

### S10 : 4 → 10 janv. · Gel

- Uniquement des branches `front/fix/...`.
- Captures d'écran pour le README.

### S11 : 11 → 15 janv. · Soutenance

- Répétitions croisées. Rendu le **15 janvier**.

---

## 4. Composants du design system (objectif ≥ 10)

| Composant | Sprint |
|---|:-:|
| `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast` | S2 |
| `Tabs`, `Dropdown`, `EmptyState`, `Skeleton`, `UserListItem` | S3 |
| `PostCard` | S4 |
| `MediaGrid`, `ProgressBar` | S5 |

Cela fait 16 composants. Le minimum de 10 est atteint dès le S3.
