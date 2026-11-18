# 2026-11-10 : Maquette flat lines v7, commentaires insérés entre le fil et la colonne de droite

## Objectif

Le panneau des commentaires ne doit plus remplacer la colonne de droite. Il doit **s'insérer entre le fil et la colonne de droite**, en les poussant vers les bords, et **prendre toute la largeur restante**. Demande d'aboumall. Les v1 à v6 sont conservées.

## Changement par rapport à la v6

| | Fermé | Ouvert (v6) | Ouvert (v7) |
|---|---|---|---|
| Grille | `nav \| marge \| fil \| droite \| marge` | Le panneau prend la place de la colonne de droite | `nav \| fil \| commentaires \| droite` |
| Fil | Centré | Inchangé | **Collé à la nav** (620 px, jusqu'à 420 px si la place manque) |
| Colonne de droite | Centrée avec le fil | Masquée | **Collée au bord droit** (avec 16 px de marge) |
| Commentaires | — | 360 px | **Toute la largeur restante** (360 px minimum) |

- Une petite animation d'apparition (fondu + glissement de 8 px), désactivée si `prefers-reduced-motion`.
- Le reste ne change pas : contenu du panneau, surbrillance du post, fermeture, fils dépliables, « Répondre ».

**Seuils de largeur :**
- **≥ 1500 px :** 4 colonnes comme ci-dessus. Par exemple, à 1920 px les commentaires font environ 640 px de large, à 1600 px environ 335 px.
- **1181 à 1499 px :** pas la place pour 4 colonnes (nav + fil + 360 px de commentaires + colonne de droite). Les commentaires prennent donc la place de la colonne de droite, comme en v6, mais occupent toute la largeur à droite du fil.
- **≤ 1180 px :** tiroir plein écran à droite, comme en v6.

**Bug corrigé pendant la vérification :** le panneau est placé après la colonne de droite dans le HTML. Le placement automatique de la grille le faisait donc passer sur une 2e ligne. Les trois blocs ont maintenant `grid-row: 1`.

## Fichier

`docs/mockups/flat-lines/v7.html` : `?comments` ouvre les commentaires du premier post ; `#ds`, `?theme=light` et `?scrolling` comme avant.

Vérifié avec des captures de Chromium headless à 1920 px (sombre et clair), 1600 px, 1440 px, et à 1920 px panneau fermé : aucune erreur dans la console.

## En attente / à valider par aboumall

1. Vers 1500-1600 px, le panneau est étroit (environ 335 px). Deux options :
   - rétrécir le fil plus tôt quand le panneau est ouvert ;
   - relever le seuil des 4 colonnes vers 1700 px.
2. L'animation d'ouverture : à garder, ou ajouter une transition de la grille (le fil et la colonne de droite qui glissent vers les bords).

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
