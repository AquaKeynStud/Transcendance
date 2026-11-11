# 2026-11-11 : Maquette du design system « flat lines »

## Objectif

Le liquid glass avait sa page de design system (palette + 24 composants), mais pas la direction flat lines. aboumall veut la même page dans le style flat lines, pour pouvoir comparer les deux directions sur le même contenu.

## Fait

- **Branches** :
  - `front/chore/mockups` commitée et poussée (`f62713d` : déplacement des maquettes liquid glass dans `docs/mockups/liquid-glass/` ; `cef30fa` : maquettes flat lines v1 à v10) ;
  - `front/chore/mockups` fusionnée dans `front/chore/design-system`, pour avoir la v10 comme référence et la même arborescence ;
  - `docs/mockups/design-system.html` déplacé dans `docs/mockups/liquid-glass/design-system.html`. Les liens ont été mis à jour dans `DESIGN_SYSTEM.md` et dans les rapports `maquette-design-system` et `statut-liquid-glass`.
- **`docs/mockups/flat-lines/design-system.html`** (nouveau) : même structure que la page liquid glass.
  - **Couleurs** : les deux thèmes côte à côte. Chaque couleur montre son token, sa valeur, son usage et son contraste WCAG, mesuré sur le fond de page puis sur une carte. Groupes : surfaces et lignes, texte et liens, couleurs fonctionnelles, états.
  - **Typographie** : Inter seule, 12 niveaux (display, titres, nav, chiffres, texte de post, commentaire, lien, légende, sur-titre).
  - **Fondations** : espacements, rayons, lignes (1 px, onglet actif 4 px, tirets), mouvement.
  - **Les 24 composants**, numérotés comme dans `DESIGN_SYSTEM.md` §5, avec leurs variantes, leurs états, leurs props et les IDs de la spec.
  - **Un 25e composant proposé** : `CommentsPanel` / `CommentItem`, le panneau des commentaires des maquettes v6 à v10 (anatomie et comportement responsive).
  - Bascule de thème dans l'en-tête, `?theme=light`, `?scrolling`. Liens vers la maquette v10 et vers la page liquid glass.
- **Vérifié** par des captures Chromium headless de la page entière, en sombre et en clair, et à 400 px : aucune erreur dans la console, pas de défilement horizontal.

## Décisions (proposées)

### Corrections de contraste par rapport à la v10

La v10 avait plusieurs couleurs sous 4,5:1, surtout en thème clair (succès, avertissement et Republier étaient lisibles en sombre mais pas en clair). La page applique les valeurs corrigées, marquées ⚠️ :

| Token | Thème | v10 | Corrigé | Contraste (fond · carte) |
|---|---|---|---|---|
| `--text-3` | sombre | `#80868C` (4,3 sur carte) | `#8A9096` | 5,5 · 4,9 |
| `--like` | sombre | `#EC3F86` (4,2 sur carte) | `#F0508F` | 5,3 · 4,7 |
| `--danger` | sombre | `#F4212E` (3,8 sur carte) | `#FF5A64` | 5,8 · 5,2 |
| `--text-3` | clair | `#6B7780` (4,2) | `#5F6B74` | 5,0 · 5,5 |
| `--link` | clair | `#1A6FD6` (4,5 de justesse) | `#1765C4` | 5,2 · 5,7 |
| `--repost` | clair | `#D97706` (2,9) | `#B45309` | 4,6 · 5,0 |
| `--success` | clair | `#00BA7C` (2,3) | `#007A52` | 4,9 · 5,4 |
| `--danger` | clair | `#F4212E` (3,8) | `#C81E28` | 5,2 · 5,7 |
| `--warning` | clair | `#FFD400` (1,3) | `#8A5A00` | 5,4 · 5,9 |

Nouveau token **`--danger-fill: #C81E28`** pour le fond du bouton Supprimer dans les deux thèmes : le texte blanc y atteint 5,7:1, contre 4,1 sur `#F4212E`.

### Adaptations des composants au style flat lines

- **01** `GlassPanel` devient **`Panel`** : fond carte + bord gris de 1 px, sans ombre. Variantes `default` (16 px) et `roomy` (24 px), plus `interactive` et `dashed`. La nav et le fil n'ont pas de panneau.
- **02** `Button` : la variante `glass` devient **`outline`** (contour gris). Ajout de la taille `lg` (52 px, bouton Publier de la nav).
- **13** `Toast` : bloc inversé (fond de la couleur du texte), petite pastille de couleur pour le type, « Annuler » souligné.
- **14** `Modal` : carte, boutons empilés en pleine largeur.
- **18** `PostCard` : posé sur le fond, sans carte. Ajout des variantes « texte long + Voir plus » et « commentaires ouverts ».
- **19** `PostAction` : icône + compteur sans pastille, disque teinté au survol.
- **22** `Sidebar` : pas de panneau, une ligne verticale à droite.

## En attente / à valider par aboumall

1. La page dans son ensemble, comparée à `liquid-glass/design-system.html`.
2. Les corrections de contraste (tableau ci-dessus). Elles devront être reportées dans une flat lines v11 si cette direction est retenue.
3. **Bords de champ** : `--line-strong` est à 2,9:1 en sombre et 1,3:1 en clair. WCAG demande 3:1 pour la limite d'un champ (critère 1.4.11). Comme X, la v10 compte sur le libellé et le placeholder. Il faut choisir : foncer le bord (`#6E7680` en sombre, ~`#8B98A1` en clair, ce qui alourdit le style) ou garder la v10.
4. Le composant 25 `CommentsPanel` : l'ajouter à `DESIGN_SYSTEM.md` §5, et dans quel lot.

## Prochaines étapes

- Choisir la direction artistique (liquid glass ou flat lines).
- Si c'est flat lines : réécrire `DESIGN_SYSTEM.md` pour ce style (il décrit encore le liquid glass), puis fusionner `front/chore/design-system` dans `frontend`.
- Ensuite : maquetter les autres écrans clés (page d'un post, profil, messages, paramètres, admin, connexion).
