# 2026-11-05 : Maquette v5, barres de défilement + titre des posts dans la spec

## Objectif

- Valider le format des posts façon Reddit et l'inscrire dans la spec fonctionnelle.
- Corriger la barre de défilement de la v4.

## Spec fonctionnelle : titre des posts (v0.4)

Décision d'aboumall : **titre obligatoire, contenu optionnel.** `docs/SPEC_FONC.md` passe en v0.4 :
- **POST-01** : titre obligatoire (3 à 120 caractères), contenu texte (≤ 500) et médias optionnels.
- **POST-03** : une réponse n'a pas de titre et doit contenir au moins du texte ou un média.
- **POST-06** : le titre est modifiable.
- **SEARCH-02** : la recherche porte sur le titre et le contenu.
- **§6 (modèle de données)** : champ `title` sur `POST`, obligatoire si `parent_id` est vide.

Le changement est commité sur `front/chore/mockups`, et reporté sur `master` par cherry-pick (commit `adb6369`) pour que toute l'équipe le voie. ⚠️ Il faut prévenir le backend (modèle `Post`, validation, recherche).

## Retour sur la v4 → changement dans la v5

| Retour | Changement |
|---|---|
| Barre de défilement comme sur la v3 : sans fond, qui disparaît quand on ne défile pas, sans arrondi, sans déborder de la tuile | Barre sans fond, pouce à angles droits (6 px visibles), invisible au repos. Elle apparaît pendant le défilement et s'efface 0,9 s après, en fondu. Marges en haut et en bas pour ne pas déborder dans les coins arrondis. Même comportement pour la colonne des plugins |

**Comment ça marche :** un petit script pose la classe `.is-scrolling` pendant le défilement. Pour obtenir le fondu dans Chrome, la couleur du pouce passe par `color` et `box-shadow: inset … currentColor`, la seule propriété de barre de défilement que Chrome sait animer.

À reprendre dans le vrai front : un hook `useAutoHideScrollbar` ou un petit composant `ScrollArea`, à ajouter au design system.

## Fichier

`docs/mockups/liquid-glass/v5.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence (utile pour les captures).

Vérifié avec des captures de Chrome headless : barres invisibles au repos, et visibles avec `?scrolling`.

## En attente / à valider par aboumall

1. Le comportement de la barre de défilement.
2. Prévenir le backend du changement de spec (titre des posts).

## Prochaines étapes

- Les autres écrans clés : page d'un post (réponses sans titre), profil, messages, paramètres, admin, connexion.
