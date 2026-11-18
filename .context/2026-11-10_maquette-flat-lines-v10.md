# 2026-11-10 : Maquette flat lines v10, liens en bleu et « Voir plus »

## Objectif

Deux retours d'aboumall sur la v9. Les v1 à v9 sont conservées.
1. Mettre en bleu les liens, comme les pseudos mentionnés, et les boutons « voir plus ».
2. Ajouter un post long pour montrer le bouton « Voir plus ».

## Changements par rapport à la v9

### Couleur des liens

Nouveau token `--link` : **`#4EA1FF`** en sombre, **`#1A6FD6`** en clair. Il s'applique à :
- les mentions `@pseudo` dans les posts et les commentaires. Elles n'étaient plus soulignées, elles le sont au survol ;
- le lien « Sur *titre du post* » en haut du panneau des commentaires ;
- les boutons « Voir plus » / « Voir moins » ;
- les boutons de fil : « Voir N réponses », « Voir 1 autre réponse », « Masquer ».

Restent en gris : le `@username` de l'en-tête des posts et des commentaires (métadonnée, pas un lien dans la maquette) et « Répondre », qui est une action.

### Texte long tronqué + « Voir plus »

- **Post :** nouveau post de Mehdi B., « Retour sur la première semaine de sprint », en 2e position du fil. Le texte est coupé à **4 lignes** avec des points de suspension. « Voir plus » déplie le texte et devient « Voir moins ».
- **Commentaire :** le commentaire de Jade, rallongé, est coupé à **3 lignes**, avec le même bouton.
- **Technique :** `-webkit-line-clamp` (classe `.clamp`, `.clamp.expanded` pour déplier). Dans le vrai front, il faudra afficher le bouton seulement quand le texte dépasse vraiment (mesure `scrollHeight > clientHeight`). La maquette l'affiche toujours, car le commentaire est dans un panneau masqué au chargement, où la mesure vaut 0.

Planche de style `#ds` : ajout de la couleur Lien.

## Fichier

`docs/mockups/flat-lines/v10.html` : `?comments` ouvre les commentaires du premier post ; `#ds`, `?theme=light` et `?scrolling` comme avant.

Vérifié avec des captures de Chromium headless (post tronqué, post déplié, thème clair, panneau des commentaires à 1920 px) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. La teinte du bleu.
2. Faut-il aussi mettre en bleu le `@username` des en-têtes (cliquable vers le profil) ?
3. La limite de troncature (4 lignes pour les posts, 3 pour les commentaires).

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
