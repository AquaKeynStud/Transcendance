# 2026-11-10 : Maquette flat lines v9, marge entre la nav et le fil quand les commentaires sont ouverts

## Objectif

Quand les commentaires sont ouverts, le fil se collait à la ligne verticale de la nav. aboumall veut garder une marge à cet endroit. Les v1 à v8 sont conservées.

## Changement par rapport à la v8

- Commentaires ouverts (≥ 1181 px) : le fil reçoit une marge à gauche de **24 px** (`padding-left: var(--space-6)`), la même qu'entre le fil, les commentaires et la colonne de droite.
- La marge est prise sur la largeur du fil (620 px max), sans pousser les autres colonnes.
- Le fond survolé ou actif des posts démarre lui aussi après la marge : il ne touche plus la ligne de la nav.
- Rien ne change panneau fermé, ni sous 1180 px (le panneau y est un tiroir par-dessus la page).

## Fichier

`docs/mockups/flat-lines/v9.html` : `?comments` ouvre les commentaires du premier post ; `#ds`, `?theme=light` et `?scrolling` comme avant.

Vérifié avec des captures de Chromium headless (1920, 1600, 1440 et 1024 px, sombre et clair) : aucune erreur dans la console.

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
