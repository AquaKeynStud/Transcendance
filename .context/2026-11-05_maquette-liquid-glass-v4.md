# 2026-11-05 : Maquette v4, posts façon Reddit

## Objectif

Appliquer les retours d'aboumall sur la v3, centrés sur les posts du fil. Les v1 à v3 sont conservées.

## Retours sur la v3 → changements dans la v4

| Retour | Changement |
|---|---|
| En-tête séparé du contenu : photo, nom, @username, temps | `post-head` sur une ligne. Le menu « … » n'apparaît qu'au survol |
| Posts façon Reddit : un titre, puis le contenu, titre plus gros | Titre en Unbounded 19 px, contenu en Manrope 15 px (interligne 1,6) |
| Plus d'espace entre l'en-tête et le titre, et entre le contenu et les actions | 24 px dans les deux cas |
| Tout aligné à gauche, pour donner plus de place aux posts | Le titre, le contenu, les médias et les actions ne sont plus décalés sous l'avatar : ils partent du bord gauche du post |
| Le survol change le fond du post | Fond légèrement plus clair et bord fin au survol. Le séparateur entre les posts disparaît autour du post survolé |
| Barre de défilement du fil tout à droite et plus épaisse | La zone qui défile touche le bord droit de la tuile. Barre de 16 px (pastille visible de 8 px), plus claire au survol. Le fondu du bas ne s'applique pas à la barre |
| (conséquence) | Actions en pastilles (répondre, republier, aimer). La rédaction a maintenant un champ **Titre** et un champ **Contenu (optionnel)** |

## Impact sur la spec fonctionnelle (à valider en équipe)

Le titre des posts n'existe pas dans `SPEC_FONC.md` (POST-01 : texte ≤ 500 caractères). Si on garde ce format :
- **POST-01** : titre obligatoire (proposition : 3 à 120 caractères), contenu et médias optionnels.
- **Réponses (POST-03)** : pas de titre, comme les commentaires sur Reddit.
- **Modèle de données (§6)** : champ `title` sur `POST`, vide pour les réponses.
- **Recherche (SEARCH-02)** : chercher aussi dans les titres.
- **Modification (POST-06)** : le titre est modifiable, avec la mention « (modifié) ».

Ça touche le backend : à présenter à l'équipe avant de l'ajouter à la spec.

## Fichier

`docs/mockups/liquid-glass-v4.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair.

Vérifié avec des captures de Chrome headless à 1440 px (sombre, avec un post en état survolé, et clair) et à 400 px. Sur mobile, les posts ont une marge intérieure réduite.

## En attente / à valider par aboumall

1. La mise en page des posts (en-tête, titre, contenu, actions en pastilles).
2. L'effet de survol.
3. La barre de défilement.
4. Le titre obligatoire (et son impact sur la spec).

## Prochaines étapes

- Retours sur la v4, puis les autres écrans clés : page d'un post (avec les réponses sans titre), profil, messages, paramètres, admin, connexion.
