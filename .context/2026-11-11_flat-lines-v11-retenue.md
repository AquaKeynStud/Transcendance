# 2026-11-11 : Flat lines retenue, maquette v11 et design system v0.3

## Objectif

aboumall a choisi la direction artistique **flat lines**. Il faut :
- appliquer les corrections de contraste proposées par la page design system dans une maquette v11 ;
- garder les bords des champs de la v10 ;
- ajouter le panneau des commentaires comme 25e composant ;
- réécrire `DESIGN_SYSTEM.md` pour le flat lines, puisqu'il décrivait encore le liquid glass.

## Fait

- **`docs/mockups/flat-lines/v11.html`** (branche `front/chore/mockups`, commit `061d30a`), générée à partir de la v10 :
  - `--text-3`, `--like` et `--danger` corrigés en sombre ;
  - `--text-3`, `--link`, `--repost`, `--success`, `--danger` et `--warning` corrigés en clair ;
  - les couleurs fonctionnelles (`--success`, `--danger`, `--warning`) ne sont plus dans `:root` : elles ont une valeur par thème ;
  - nouveau token `--danger-fill: #C81E28` pour le fond du bouton Supprimer (texte blanc 5,7:1) ;
  - la planche de style `#ds` lit maintenant les valeurs des tokens du thème courant (avant, elle affichait les valeurs du sombre en dur, même en thème clair). Ajout de la couleur « Fond Supprimer ».
  - Rien d'autre ne change : mise en page, composants, bords des champs.
- `front/chore/mockups` fusionnée dans `front/chore/design-system`.
- **`docs/DESIGN_SYSTEM.md` v0.3**, réécrit pour le flat lines :
  - principes (aplats et lignes, deux niveaux de surface : fond / carte) ;
  - palette des deux thèmes, contrastes « fond · carte » avant et après correction ;
  - typo Inter seule, fondations (espacements, rayons, lignes, mouvement, icônes), mise en page et points de rupture ;
  - table des **25 composants**, adaptée au style (`GlassPanel` → `Panel`, `Button` en `outline` et `lg`, etc.) ;
  - extrait de config Tailwind v4 avec les tokens flat lines ;
  - décisions du 2026-11-11 (§8).
- **`docs/mockups/flat-lines/design-system.html`** : liens vers la v11, composant 25 au lot 2, compteurs de lots mis à jour (lot 2 : 11), note sur les bords de champ remplacée par la décision.
- `.context/README.md` : bandeau « État de la direction artistique » mis à jour.
- Vérifié par des captures de Chrome headless : v11 (accueil, commentaires, planche de style en sombre et en clair) et page design system.

## Décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Direction artistique | **Flat lines** | Choix d'aboumall. Plus adaptée à un réseau social, plus légère à rendre (pas de `backdrop-filter`), passage à Tailwind quasi direct |
| Contrastes | Corrections appliquées (v11) | Toutes les couleurs de texte passent 4,5:1 sur le fond et sur les cartes, dans les deux thèmes |
| Bords des champs | On garde la v10 (`--line-strong` 2,9:1 en sombre, 1,3:1 en clair) | Choix d'aboumall : style plus léger. Libellé, placeholder et bord au focus suffisent |
| Composant 25 `CommentsPanel` / `CommentItem` | Ajouté au §5, **lot 2** | Il dépend de `PostAction` et `Composer` (lot 2) et n'est pas nécessaire pour atteindre les 10 composants du lot 1 |

## En attente / à valider par aboumall

1. Les questions encore ouvertes dans les rapports flat lines v2 à v10. Elles ne bloquent pas :
   - la teinte du bleu des liens ;
   - le `@username` des en-têtes en bleu ou non ;
   - le nombre de lignes avant « Voir plus » (4 pour les posts, 3 pour les commentaires) ;
   - l'écart de teinte entre carte et fond ;
   - le libellé « Commentaires » alors que la spec parle de « réponses ».
2. Fusionner `front/chore/design-system` dans `frontend`.

## Prochaines étapes

- Maquetter les autres écrans clés en flat lines : page d'un post, profil, messages, paramètres, admin, connexion.
- Sprint S2 : setup du front (`front/chore/setup`), puis les tokens (`front/feat/design-tokens`) et les composants du lot 1 (`front/feat/ds-base-components`).
- Prévenir le backend du titre obligatoire sur les posts (spec v0.4), si ce n'est pas déjà fait.
