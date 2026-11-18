# 2026-11-10 : Maquette flat lines v4, fil sans lignes verticales

## Objectif

Retirer les lignes verticales qui bordent le fil, à la demande d'aboumall. Les v1 à v3 sont conservées.

## Changement par rapport à la v3

- **Fil :** suppression des lignes verticales à gauche et à droite (`.center`). Le fil n'est plus délimité que par :
  - les lignes horizontales entre les posts ;
  - la ligne sous les onglets.
- **Tablette (≤ 1180 px) :** suppression aussi des lignes verticales autour du bloc recherche + rédaction + plugins. Seule reste la ligne horizontale qui le sépare du fil.
- **Inchangé :** la ligne verticale de la nav (collée à gauche), la palette de la v2 et le bento à droite.

## Fichier

`docs/mockups/flat-lines/v4.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chromium headless (1440 px sombre et clair, 1024 px) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. Sans bordure, les lignes entre les posts s'arrêtent net aux bords du fil. À voir s'il faut les raccourcir (marge intérieure, comme dans la liquid glass) ou les garder pleine largeur.

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
