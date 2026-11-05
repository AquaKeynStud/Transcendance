# 2026-11-05 : Maquette v7, couleurs des actions J'aime et Republier

## Objectif

Appliquer les retours d'aboumall sur la v6. Les versions précédentes sont conservées.

## Retours sur la v6 → changements dans la v7

| Retour | Changement |
|---|---|
| J'aime : un rouge / pourpre qui rend bien, pas un rouge classique | **Framboise pourpre** `#EC3F86` en sombre, `#C0185E` en clair |
| Republier : du jaune / orange | **Ambre orangé** `#FFA834` en sombre, `#D97706` en clair |

**Détail des états :**
- **Actif** (aimé, republié) : l'icône et le chiffre prennent la couleur. La pastille reçoit un fond teinté à 14 %, un bord fin à 38 % et un léger halo. Le cœur est rempli, l'icône de republication est plus épaisse.
- **Survol** : l'icône et le chiffre prennent la couleur, sans fond.
- **Clic** : petite animation de l'icône (agrandissement).
- La ligne « X a republié » au-dessus d'un post a son icône en ambre.
- Les teintes sont calculées avec `color-mix()` à partir de deux variables (`--like`, `--repost`), faciles à reporter dans le thème Tailwind.

**Pourquoi `#EC3F86` et pas un rouge plus classique :** un premier essai (`#FF4F7E`) était trop proche du rouge d'erreur (`#FF5C7A`). La teinte a été décalée vers le pourpre pour que « J'aime » et « Supprimer » ne se confondent pas.

**Démo dans le fil :** post de Léa aimé, post de Théo republié, post de Nora aimé et republié. La planche de style (`#ds`) montre les 5 états côte à côte et ajoute les deux couleurs à la palette.

Correction au passage : dans la planche de style, les libellés de la typographie avaient pris le style des blocs de code ajouté en v4.

## Fichier

`docs/mockups/liquid-glass-v7.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chrome headless (accueil sombre et clair, planche de style).

## En attente / à valider par aboumall

1. Les deux couleurs et l'intensité du halo.

## Prochaines étapes

- Les autres écrans clés : page d'un post (réponses sans titre), profil, messages, paramètres, admin, connexion.
