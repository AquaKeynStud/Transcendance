# 2026-11-10 : Maquette flat lines v6, panneau des commentaires

## Objectif

Ajouter l'aperçu du panneau des commentaires, à la demande d'aboumall. Le bouton « commentaires » d'un post ouvre un panneau à droite du fil. Le modèle de référence est le panneau de commentaires de TikTok (capture fournie) : on reprend l'organisation, pas le style. Les v1 à v5 sont conservées.

## Rapport avec la spec

Un « commentaire » est une **réponse** au sens de `SPEC_FONC.md` :
- **POST-03** : pas de titre, du texte et/ou un média ;
- **POST-03** : on peut répondre à une réponse, ce qui forme un fil ;
- **POST-04** : les réponses sont triées de la plus ancienne à la plus récente.

Le panneau n'ajoute donc rien au backend : il affiche les réponses directes d'un post, et leurs propres réponses se déplient sous chacune.

## Fait

- **Ouverture :** clic sur le bouton commentaires (bulle) d'un post.
  - Le panneau prend la place de la colonne de droite (recherche, rédaction, plugins), dans la même colonne de grille.
  - Le post concerné reste en surbrillance (fond du survol, bouton bulle actif).
  - Un 2e clic sur la même bulle, la croix ou `Échap` ferment le panneau, et la colonne de droite revient.
  - Cliquer la bulle d'un autre post bascule le panneau sur ce post (compteur et titre mis à jour).
- **Contenu du panneau :**
  - **En-tête :** « Commentaires » + nombre, ligne « Sur <titre du post> » (lien vers la page du post), croix.
  - **Commentaire :** avatar, nom, @username · temps, texte, média éventuel. Puis « Répondre » à gauche et J'aime + compteur à droite, en framboise quand il est actif.
  - **Fil :** « —— Voir N réponses ⌄ » déplie les réponses, en retrait et avec des avatars plus petits ; « Masquer ⌃ » les replie. S'il reste des réponses non chargées : « Voir 1 autre réponse ».
  - **Pied :**
    - champ arrondi « Ajouter un commentaire… » avec des boutons mention, média et emoji, et un bouton d'envoi rond, grisé tant que le champ est vide ;
    - « Répondre » sur un commentaire affiche au-dessus du champ un bandeau « En réponse à @… » avec une croix pour l'annuler.
- **Style :** le même que le reste de la flat lines. Tuile à bord gris de 1 px, ligne raccourcie sous l'en-tête, ligne pleine au-dessus du pied, aucune ombre. La liste défile seule, avec la même barre de défilement masquée au repos.
- **Responsive :** sous 1180 px, le panneau devient un tiroir plein écran à droite (420 px max, toute la largeur sur mobile), au-dessus du reste.
- **Planche de style `#ds` :** ajout du composant « Commentaire (réponse) et fil ».
- **Démo :** `?comments` ouvre directement les commentaires du premier post (utile pour les captures).

## Fichier

`docs/mockups/flat-lines/v6.html` : `?comments`, `#ds`, `?theme=light`, `?scrolling`.

Vérifié avec Chromium headless (Playwright), sans aucune erreur dans la console :
- ouverture par clic, « Répondre » et saisie ;
- thème clair ;
- 1024 px et 400 px ;
- fermeture (la colonne de droite revient).

Un bug corrigé pendant la vérification : le champ de saisie débordait du panneau (`min-width: 0` manquant).

## En attente / à valider par aboumall

1. Le panneau **remplace** la colonne de droite. L'autre option est de l'ouvrir **en plus**, avec un fil plus étroit.
2. Le libellé « Commentaires », alors que la spec parle de « réponses ». À harmoniser dans l'UI (onglet « Réponses » du profil, ACC-02).
3. La profondeur des fils : un seul niveau de retrait est affiché. Les réponses à une réponse de 2e niveau pourraient rester au même retrait avec « En réponse à @… », comme TikTok.

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans (page d'un post, profil, messages, paramètres, admin, connexion).
