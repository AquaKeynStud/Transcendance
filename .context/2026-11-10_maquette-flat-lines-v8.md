# 2026-11-10 : Maquette flat lines v8, commentaires moins larges et composants plus contrastés

## Objectif

Deux retours d'aboumall sur la v7. Les v1 à v7 sont conservées.
1. Rendre le panneau des commentaires un peu moins large.
2. Plus de contraste entre les composants et le fond, surtout pour le panneau des commentaires.

## Changements par rapport à la v7

### 1. Largeur des commentaires

- Panneau limité à **520 px** (+ 24 px de marge), contre environ 640 px à 1920 px en v7. Minimum inchangé : 360 px.
- L'espace en trop n'agrandit plus le panneau. Il est réparti à parts égales de chaque côté, et le panneau reste centré entre le fil et la colonne de droite.
- Grille ouverte : `nav | fil | marge | commentaires | marge | droite`.
- Effet de bord positif : vers 1600 px, c'est maintenant le fil qui rétrécit un peu. Le panneau passe d'environ 335 px (v7) à environ 410 px.

### 2. Contraste : un fond « carte » pour les composants

Nouveaux tokens, appliqués aux tuiles (rédaction, plugins), à la barre de recherche et au panneau des commentaires :

| Token | Sombre | Clair | Rôle |
|---|---|---|---|
| `--card` | `#202329` | `#FFFFFF` | Fond des composants |
| `--card-line` | `#3A3F47` | `#DBE2E7` | Bord des composants (plus marqué que `--line`) |
| `--well` | `#16181C` | `#F3F5F7` | Creux dans une carte (champ « Ajouter un commentaire… ») |
| `--avatar` | `#3A3F46` | `#DFE5E9` | Fond des avatars sans photo, plus visible sur les cartes |

- **Thème sombre :** le fond de page reste `#16181C`. Les cartes sont plus claires, avec un bord plus visible.
- **Thème clair :** le fond de page passe de blanc à **`#F3F5F7`** pour que les cartes blanches se détachent. Les lignes passent de `#EFF3F4` à `#E4E9EC`.
- **Panneau des commentaires :**
  - chaque commentaire s'éclaire légèrement au survol ;
  - le champ de saisie est en creux (`--well`) pour bien se détacher de la carte.
- **Le fil ne change pas :** les posts restent directement sur le fond de page, séparés par des lignes. Seuls les composants « posés » sont en carte.

## Fichier

`docs/mockups/flat-lines/v8.html` : `?comments` ouvre les commentaires du premier post ; `#ds` (avec les nouvelles couleurs Carte et Bord de carte), `?theme=light` et `?scrolling` comme avant.

Vérifié avec des captures de Chromium headless (1920 px sombre et clair, 1600 px, 1440 px, 1024 px, planche de style) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. L'écart de teinte carte / fond (`#202329` sur `#16181C`) : suffisant, ou plus marqué ?
2. Le fond gris clair `#F3F5F7` en thème clair.
3. Faut-il aussi mettre le fil sur une carte, ou le garder « à plat » ?

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
