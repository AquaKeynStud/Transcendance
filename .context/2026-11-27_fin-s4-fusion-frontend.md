# Fin du S4 et fusion des branches front dans `frontend`

## 1. Objectif

Clore le S4 (« Je poste et je vois un fil ») et regrouper toutes les branches front dans `frontend`, avant une PR vers `master`.

## 2. Fait

- Les tâches du S4 de `docs/FRONT_PLAN.md` étaient déjà codées dans `front/feat/s3-s4-pages` :
  - `PostCard` : compteurs, « (modifié) », « Post supprimé » ou « Post supprimé par la modération », menu d'actions (POST-06, POST-08) ;
  - rédaction : titre de 3 à 120 caractères, texte de 500 au plus, médias facultatifs (POST-01, spec v0.4) ;
  - fils Abonnements et Explorer avec défilement infini (FEED-01, FEED-02) ;
  - modifier et supprimer, avec confirmation et toasts (POST-06, POST-07, NOTIF-03).
- Fusion dans `frontend`, sans PR, une branche après l'autre (`--no-ff`), dans l'ordre de la pile :
  `front/chore/setup` → `front/feat/design-tokens` → `front/feat/ds-components` → `front/feat/api-mocks` → `front/feat/s3-s4-pages` → `front/feat/auth-pages`.
- Les fichiers de `frontend` sont maintenant identiques à ceux de `front/feat/auth-pages`. `typecheck` et `build` passent.

## 3. Décisions

- Les fusions et ce rapport sont faits sans PR et sans ligne `Co-Authored-By`, à la demande d'aboumall.
- `front/chore/design-system` et `front/feat/pages` étaient déjà dans `frontend` : rien à fusionner.

## 4. En attente / à valider

- Relecture de `frontend` par aboumall, puis PR `frontend` → `master`.
- Les vérifications complètes (navigateur, lint, format) sont à refaire sur `frontend`.
- Les routes de l'API attendues par le front sont à valider avec le back (voir `2026-11-24_pages-s3-s4.md`, §4).
- En retard par rapport au plan : la page `/design-system` (S2) ne montre que les tokens, pas de validation Zod, Vitest pas installé.

## 5. Prochaines étapes

1. PR `frontend` → `master`.
2. S5 : page d'un post et ses réponses, plein écran des médias.
