# 2026-11-10 : Maquette flat lines v5, lignes du fil raccourcies

## Objectif

Raccourcir les lignes horizontales du fil, à la demande d'aboumall. Les v1 à v4 sont conservées.

## Changement par rapport à la v4

- **Lignes entre les posts et sous les onglets :** elles ne vont plus d'un bord à l'autre du fil. Elles s'arrêtent à **20 px** de chaque bord (16 px sur mobile), à l'aplomb du texte des posts.
  - Elles sont dessinées par un pseudo-élément (`::after`) et non plus par une bordure.
  - Le retrait est réglable avec une seule variable, `--rule-inset`, sur `.feed`.
- **Survol d'un post :** le fond plus clair prend des coins arrondis (16 px). Les lignes au-dessus et au-dessous du post survolé disparaissent, comme dans la liquid glass v4, pour ne pas couper le fond arrondi.
- **Inchangé :** la nav collée à gauche avec sa ligne verticale, la palette et le bento à droite.

## Fichier

`docs/mockups/flat-lines/v5.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chromium headless (1440 px sombre et clair, survol d'un post, 1024 px) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. La longueur du retrait (20 px). On peut raccourcir davantage, par exemple 40 px, ou centrer des lignes plus courtes.
2. Le survol arrondi.

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
