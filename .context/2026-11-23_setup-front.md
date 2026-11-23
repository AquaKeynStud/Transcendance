# Setup du front (`front/chore/setup`)

## 1. Objectif

Passer des maquettes au code : poser la stack de `docs/SPEC_TECH.md` §11.1, l'arborescence §11.2 et un layout vide où la navigation entre les pages marche. C'est la fin de sprint visée en S1 dans `docs/FRONT_PLAN.md`.

## 2. Fait

- **Stack** installée dans `frontend/`, en dernières versions :

  | Outil | Version |
  |---|---|
  | React | 19.3 |
  | React Router | 8.5 |
  | TanStack Query | 5.108 |
  | Lucide | 1.78 |
  | Vite | 8.3 |
  | TypeScript | 6.0 |
  | Tailwind | 4.3 (plugin `@tailwindcss/vite`, pas de `tailwind.config`) |
  | MSW | 3.0 |
  | ESLint | 10 (config « flat ») |
  | Prettier | 3.10 (plugin Tailwind pour trier les classes) |

- **Node 22** : `frontend/Dockerfile` passe à `node:22-alpine` et utilise `npm ci`. Vite 8 demande Node 22.12 ou plus (`engines` dans `package.json`).
- **Arborescence** (§11.2) : `src/app/` (App, providers, router, layouts), `src/pages/` (Placeholder, NotFound), `src/mocks/` (MSW). `design-system/`, `features/` et `lib/` sont prévus mais pas encore créés, parce que Git ne versionne pas les dossiers vides.
- **Routes** : tous les écrans de `SPEC_FONC.md` §7, dans `src/app/router.tsx`.
  - Deux layouts :
    - `AuthLayout` pour `/login`, `/signup`, `/verify-email`, `/forgot-password` et `/reset-password` : pas de navigation, contenu centré ;
    - `RootLayout` pour le reste : navigation à gauche (en haut sur mobile), contenu, pied de page.
  - Chaque page affiche son titre, ses IDs de spec et son sprint. La 404 est une vraie page.
  - URLs choisies :

    | Écran | URL |
    |---|---|
    | Profil | `/u/:username` |
    | Abonnés, abonnements, amis | `/u/:username/followers`, `/following`, `/friends` |
    | Post | `/posts/:postId` |
    | Messages | `/messages/:conversationId?` |
    | Paramètres | `/settings/profile`, `/account`, `/privacy`, `/security`, `/data`, `/delete` |
    | Administration | `/admin/users`, `/admin/users/:username`, `/admin/log` |
    | Recherche | `/search` |
    | Demandes d'abonnement | `/requests` |
    | Design system | `/design-system` |
- **MSW** : il tourne en dev et répond à `GET /api/v1/auth/csrf` et `GET /api/v1/auth/me`. Pour l'instant, `me` renvoie toujours 401 : on est donc toujours visiteur, au format d'erreur du §3. `VITE_MSW=off` le coupe. Les appels `/api` et `/ws` partent alors vers le backend par le proxy de Vite (`API_PROXY_TARGET`, `http://backend:8000` dans `docker-compose.yml`).
- **Scripts** : `dev`, `build` (`tsc` puis `vite build`), `typecheck`, `lint`, `format` et `format:check`.
- `Makefile` : `frontend/package-lock.json` est ajouté aux dépendances de `build`.

## 3. Vérifié

- `npm run typecheck`, `lint`, `format:check` et `build` passent.
- L'image Docker du front se construit et sert l'app, le service worker MSW et les routes de la SPA. Elle a été testée seule, sans backend.
- Firefox headless (Playwright) a vérifié :
  - les 12 routes testées affichent le bon titre ;
  - `/settings` redirige vers `/settings/profile`, et `/admin` vers `/admin/users` ;
  - une URL inconnue donne la 404 ;
  - le clic dans la navigation marche, et le lien de la page courante est marqué actif ;
  - MSW répond bien ;
  - **la console n'a aucune erreur ni aucun avertissement**.

## 4. Décisions

- **Versions plus récentes que la spec** (React 19, React Router 8, MSW 3). Changement à connaître : dans MSW 3, `onUnhandledRequest` s'appelle maintenant `onUnhandledFrame`.
- Le fond `#0d0f11` est posé en dur dans `index.css`, en attendant les tokens (`front/feat/design-tokens`).

## 5. En attente / à valider

- Les URLs ci-dessus, en particulier `/u/:username` pour les profils.
- Vitest et Testing Library (§7 de SPEC_TECH) ne sont pas encore installés : ils arriveront avec les premiers composants.

## 6. Prochaines étapes

1. `front/feat/design-tokens` : palette, typo, espacements et rayons de `DESIGN_SYSTEM.md` v0.5 dans le thème Tailwind (`@theme`).
2. `front/feat/ds-base-components` : `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast`.
3. `front/feat/api-client`, puis les pages d'authentification.
