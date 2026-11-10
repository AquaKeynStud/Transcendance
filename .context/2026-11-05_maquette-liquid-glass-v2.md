# 2026-11-05 : Maquette v2, liquid glass monochrome

## Objectif

Appliquer les retours d'aboumall sur la v1 (« bien pour une première version, mais pas satisfait »). La v1 est conservée telle quelle pour comparer.

## Retours sur la v1 → changements dans la v2

| Retour | Changement |
|---|---|
| Plus d'espace autour de la page | Marge de page de 28 px (`--page-pad`), 20 px entre les blocs (`--gap`) |
| Pas d'accent bleu, plutôt blanc / gris | Accent = blanc perle (bouton principal, badges, liens) en sombre, graphite en clair. Fond, rubans et images en niveaux de gris. Seuls restent en couleur : vert « en ligne », rouge erreur, jaune avertissement |
| Pas de barre « Bonjour, … » | Supprimée : la colonne centrale commence directement par la rédaction |
| Recherche en haut à droite, au-dessus des plugins | Colonne de droite : barre de recherche, puis la liste des plugins |
| Retirer les tuiles Notifications, Messages et Profil (déjà dans la nav) | Supprimées |
| Plugins et fil défilent séparément, le fil défile dans sa tuile | La page ne défile plus (`height: 100vh`). Le fil prend la hauteur restante sous la rédaction et défile à l'intérieur. Les plugins ont leur propre défilement. Le bas du fil, de la nav et des plugins est aligné |
| Avatars sans photo : pas de couleurs | Cercle en verre liquide, initiales blanches plus grandes (44 % du diamètre) |

## Fichier

`docs/mockups/liquid-glass/v2.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair.

Plugins de démo dans la colonne de droite : Météo, Horloge, Focus (minuteur), Snake, Musique, « Ajouter un plugin ».

## Responsive

- **> 1180 px** : 3 colonnes (nav | rédaction + fil | recherche + plugins). Rien ne défile sauf le fil et les plugins.
- **≤ 1180 px** : nav réduite aux icônes. La recherche reste en haut, les plugins passent en **bande horizontale** sous la recherche, puis la rédaction et le fil. La page défile normalement.
- **≤ 720 px** : nav en barre en bas de l'écran, une colonne.

Vérifié avec des captures de Chrome headless à 1440 px (sombre et clair), 1024 px et 400 px.

## En attente / à valider par aboumall

1. Le rendu monochrome (est-ce que le vert « en ligne » doit aussi passer en blanc ?).
2. La largeur de la colonne des plugins (380 px, 340 px sous 1440 px).
3. Les plugins en bande horizontale sur tablette et mobile.
4. Le fondu en bas des zones qui défilent.

## Prochaines étapes

- Retours sur la v2, puis les autres écrans clés : page d'un post, profil, messages, paramètres, admin, connexion.
