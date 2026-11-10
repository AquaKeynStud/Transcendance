# 2026-11-05 : Maquette v8, actions J'aime et Republier sans brillance

## Objectif

Appliquer le retour d'aboumall sur la v7. Les versions précédentes sont conservées.

## Retour sur la v7 → changement dans la v8

| Retour | Changement |
|---|---|
| Enlever l'effet de brillance sur les boutons J'aime et Republier | Suppression du halo autour de la pastille et de la lueur autour de l'icône (`drop-shadow`). On garde la couleur de l'icône et du chiffre, le fond teinté à 14 % et le bord fin à 38 % |

Le reste est identique à la v7 (couleurs `#EC3F86` et `#FFA834`, survol coloré, animation au clic).

## Fichier

`docs/mockups/liquid-glass/v8.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec une capture de Chrome headless (planche de style).

## Prochaines étapes

- Les autres écrans clés : page d'un post (réponses sans titre), profil, messages, paramètres, admin, connexion.
