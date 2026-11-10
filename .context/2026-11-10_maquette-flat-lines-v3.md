# 2026-11-10 : Maquette flat lines v3, nav collée à gauche

## Objectif

Tester une version où la nav est collée au bord gauche de l'écran, à la demande d'aboumall. Les v1 et v2 sont conservées.

## Changement par rapport à la v2

Même palette que la v2 (fond `#16181C`). Seule la mise en page change.

| | v2 | v3 |
|---|---|---|
| Nav | Les 3 colonnes forment un bloc centré : sur un grand écran, la nav flotte avec du vide à sa gauche | **Nav collée au bord gauche**, sur toute la hauteur, séparée du reste par une ligne verticale grise |
| Fil + colonne de droite | Centrés avec la nav | **Centrés dans l'espace restant**, à droite de la nav |
| Planche de style `#ds` | Bloc centré avec la nav | Contenu centré (1040 px max) à droite de la nav, titre sur toute la largeur |

**Comment :** grille à 5 colonnes, dans l'ordre : `nav | marge | fil | colonne de droite | marge`.
- Les deux marges sont élastiques (`1fr`), donc le fil et la colonne de droite restent centrés.
- Les largeurs sont des variables (`--nav-w` 275 px, `--feed-w` 620 px, `--rail-w` 360 px), plus faciles à reporter dans le thème Tailwind.

**Responsive :**
- sous 1180 px, nav en icônes, toujours collée à gauche avec sa ligne ; le reste fait 640 px max, centré ;
- sous 720 px, barre en bas, comme avant.

## Fichier

`docs/mockups/flat-lines/v3.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chromium headless (1920, 1440, 1024 et 400 px, planche de style) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. Sur un écran très large (1920 px), il y a un grand vide entre la nav et le fil. À voir :
   - le garder ;
   - coller aussi le fil à la nav ;
   - élargir le fil.

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
