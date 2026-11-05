# 2026-11-05 : Design system, palette et table des composants

## Objectif

La maquette v8 est validée par aboumall. Il faut en tirer la documentation du module bonus `web.design_system` : la palette de couleurs et la table des composants réutilisables.

## Fait

- **Branches :**
  - `front/chore/mockups` fusionnée dans `frontend` (`--no-ff`, commit `a8f1f9b`) et poussée. La v8 devient la référence sur `frontend`.
  - Nouvelle branche `front/chore/design-system`, créée depuis `frontend`.
- **`docs/DESIGN_SYSTEM.md`** (v0.1) :
  - tableau de couverture des exigences du module (palette, typo, icônes, ≥ 10 composants, documentation) ;
  - principes (monochrome, verre limité aux grandes surfaces, deux thèmes, accessibilité) ;
  - **palette** : neutres, accent (blanc perle / graphite), couleurs fonctionnelles (J'aime, Republier, succès, erreur, avertissement), matières (verre, chrome, survol, barre de défilement), avatars sans photo ;
  - **contrastes WCAG** mesurés sur une tuile de verre, avec des corrections proposées ;
  - typographie (Unbounded + Manrope, échelle complète), espacements, rayons, mouvement, icônes (Lucide), points de rupture ;
  - **table de 24 composants** en 3 groupes (primitives, retours et superpositions, métier), avec rôle, variantes et états, props, lien vers les IDs de la spec, lot et statut de maquette. **13 au lot 1**, ce qui dépasse le minimum de 10 ;
  - plan de la page `/design-system` de la SPA ;
  - extrait de config Tailwind v4 (`@theme` + variables par thème).

## Décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Où vit la doc | `docs/DESIGN_SYSTEM.md` + page `/design-system` dans la SPA | La page est la preuve visible en soutenance, le `.md` sert à l'équipe |
| Storybook | Non | La page interne suffit et coûte moins |
| Couleurs du thème clair | Valeurs propres, plus foncées | En v8, le clair réutilisait les couleurs du sombre, illisibles sur fond clair (contraste 1,3 à 2,8) |
| Polices | Auto-hébergées dans le build | Ne pas appeler Google Fonts en production (RGPD) |
| Verre en Tailwind | Composant `GlassPanel` avec une classe CSS dédiée | Les recettes de verre (masque, flou, dégradés) n'entrent pas bien dans des classes utilitaires |

## Contrastes : corrections proposées (⚠️ dans le doc)

| Couleur | Thème | v8 | Corrigé | Contraste |
|---|---|---|---|---|
| `--text-3` | sombre | .42 | .52 | 3,8 → 5,0 |
| `--text-3` | clair | .45 | .58 | 3,0 → 4,6 |
| `--like` | sombre | `#EC3F86` | `#F0508F` | 4,3 → 4,8 |
| `--repost` | clair | `#D97706` | `#A8530A` | 2,8 → 4,7 |
| `--success` | clair | `#3DDC97` | `#12985F` | 1,5 → 3,2 (point, seuil 3:1) |
| `--danger` | clair | `#FF5C7A` | `#C42347` | 2,6 → 5,0 |
| `--warning` | clair | `#FFC857` | `#92600A` | 1,3 → 4,7 |
| Bouton Supprimer | les deux | fond `#FF5C7A` | dégradé `#E04A68 → #C92A4A` | 3,0 → 4,7 |

## En attente / à valider par aboumall

1. Les corrections de contraste (§2.6 du doc).
2. Le découpage en lots.
3. Pas de Storybook, seulement la page `/design-system`.

## Prochaines étapes

- Composants à maquetter : `Spinner`/`Skeleton`, `EmptyState`, `Dropdown`, `UserListItem`, post en mode réponse, `MediaGrid` à plusieurs médias.
- Sprint S2 : setup du front (`front/chore/setup`), puis les tokens (`front/feat/design-tokens`) et les composants du lot 1 (`front/feat/ds-base-components`).
