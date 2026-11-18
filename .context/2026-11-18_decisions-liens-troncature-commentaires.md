# 2026-11-18 : Liens, troncature et commentaires, fusion dans `frontend`

## Objectif

- Fusionner `front/chore/design-system` dans `frontend`.
- Noter les réponses d'aboumall aux questions encore ouvertes depuis les maquettes flat lines v2 à v10.
- Ouvrir la PR de `frontend` et supprimer les branches front qui ne servent plus.

## Fait

- `front/chore/design-system` fusionnée dans `frontend` (`4ecad68`), et le point coché dans le rapport [2026-11-11_flat-lines-v11-retenue.md](2026-11-11_flat-lines-v11-retenue.md).
- **`docs/DESIGN_SYSTEM.md` v0.4** :
  - `--link` et la typo « Légende » : le `@username` des en-têtes reste gris ;
  - nouvelle section **§4.7 Troncature « Voir plus »** (budget de hauteur) ;
  - `PostCard` (18) et `CommentItem` (25) renvoient vers §4.7, au lieu des 4 et 3 lignes fixes ;
  - §8 : décisions du 2026-11-18.
- Branches `front/chore/design-system` et `front/chore/mockups` supprimées, en local et sur origin : elles étaient entièrement fusionnées dans `frontend`.

## Décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Teinte du bleu des liens | Validée (`#4EA1FF` en sombre, `#1765C4` en clair) | Choix d'aboumall |
| `@username` en bleu | Seulement pour une mention dans le texte d'un post ou d'un commentaire. Celui de l'en-tête reste gris | Le bleu signale un lien dans le contenu. L'en-tête est une métadonnée |
| Troncature « Voir plus » | Budget de hauteur, médias compris : 45 % de la hauteur visible du fil pour un post (3 lignes minimum), 30 % de la liste pour un commentaire (2 lignes minimum) | Un post avec image doit montrer moins de texte qu'un post sans image. Les pourcentages sont à ajuster sur le vrai front |
| Contrastes | Les valeurs actuelles sont validées. Il faut qu'ils restent cohérents | Choix d'aboumall |
| « Commentaires » ou « réponses » | Le front garde « Commentaires » et le panneau dédié. Dans les données, ce sont toujours des posts en réponse (POST-03) : la spec ne change pas | aboumall préfère un onglet de commentaires à des réponses à dérouler dans le fil |

## En attente / à valider par aboumall

1. Les pourcentages du budget de troncature (45 % et 30 %) et les minimums (3 et 2 lignes).
2. Les maquettes v10 et v11 et `design-system.html` coupent encore le texte à 4 et 3 lignes fixes. Elles sont gardées telles quelles : la règle de référence est celle de `DESIGN_SYSTEM.md` §4.7.

## Prochaines étapes

- Relire et fusionner la PR `frontend` → `master`.
- Maquetter les autres écrans clés en flat lines : page d'un post, profil, messages, paramètres, admin, connexion.
- Sprint S2 : `front/chore/setup`, puis `front/feat/design-tokens` et `front/feat/ds-base-components`.
