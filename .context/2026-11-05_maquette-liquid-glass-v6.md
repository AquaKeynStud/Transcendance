# 2026-11-05 : Maquette v6, barres de défilement natives + fond sombre adouci

## Objectif

Appliquer les retours d'aboumall sur la v5. Les versions précédentes sont conservées.

## Retours sur la v5 → changements dans la v6

| Retour | Changement |
|---|---|
| Enlever le fond des barres de défilement et les faire disparaître quand on ne défile pas, comme dans la v3 | Retour à la **barre native** de la v3 (`scrollbar-width: thin`, piste transparente). La barre dessinée à la main de la v5 (`::-webkit-scrollbar`) réservait sa propre bande à droite, d'où le « fond ». En plus de la v3 : la barre est **transparente au repos** et n'apparaît que pendant le défilement (classe `.is-scrolling` posée en JS, retirée 0,9 s après) |
| Fond sombre un peu moins noir, et adapter le reste | Fond `#000000` → `#111214` (gris anthracite). Verre légèrement plus lumineux, ombres des tuiles moins fortes, creux (champs, onglets) un peu moins noirs, fond des images de démo aligné |

## Limite connue

Avec la barre native, on ne contrôle plus la forme (arrondie ou non) : elle dépend du système et du navigateur. C'était le choix à faire pour retrouver le comportement de la v3. La demande d'angles droits de la v5 n'est donc plus garantie.

## Fichier

`docs/mockups/liquid-glass/v6.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chrome headless : barres invisibles au repos, et visibles avec `?scrolling`.

## En attente / à valider par aboumall

1. Le comportement des barres de défilement dans son navigateur.
2. La teinte du fond (`#111214`).

## Prochaines étapes

- Les autres écrans clés : page d'un post (réponses sans titre), profil, messages, paramètres, admin, connexion.
