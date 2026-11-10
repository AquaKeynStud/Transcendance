# 2026-11-10 : Maquette flat lines v1, une 2e direction artistique

## Objectif

Avant de maquetter les autres écrans, aboumall veut comparer plusieurs directions artistiques. Cette 2e direction est plus simple que le liquid glass :
- elle garde le principe du bento ;
- elle s'inspire de la sobriété des composants de X (capture fournie) : aplats, séparations par de simples lignes grises ;
- ce n'est pas une copie : on garde la composition, le contenu et les couleurs d'action de la liquid glass v8.

## Fait

- **Réorganisation des maquettes en sous-dossiers, un par direction artistique :**
  - `docs/mockups/liquid-glass/v1.html` → `v8.html` (déplacés avec `git mv`) ;
  - `docs/mockups/flat-lines/v1.html` (nouveau).

  Les liens dans les rapports liquid glass v1 à v8 ont été mis à jour.
- **Maquette `docs/mockups/flat-lines/v1.html`.** Même composition que la liquid glass v8 :
  - nav à gauche ;
  - fil au centre, qui défile seul ;
  - à droite : recherche, rédaction (titre + contenu optionnel), plugins en bento ;
  - planche de style `#ds` avec les mêmes composants.
- **Paramètres d'URL** inchangés : `?theme=light`, `#ds`, `?scrolling`.
- **Vérifications** par des captures Chromium headless (Playwright) :
  - accueil sombre et clair à 1440 px, survol d'une action, planche de style, 1024 px et 400 px ;
  - aucune erreur ni warning dans la console.

## Décisions de style (proposées)

| Élément | Liquid glass v8 | Flat lines v1 |
|---|---|---|
| Fond | `#111214` | Noir `#000000` (clair : blanc) |
| Surfaces | Verre (flou, bord brillant, reflet) | Aplats, **aucune ombre ni dégradé** |
| Séparations | Espaces entre les tuiles | **Lignes grises de 1 px** `#2F3336` (clair : `#EFF3F4`) |
| Fil | Tuile en verre | Colonne bordée par deux lignes verticales. Posts séparés par une ligne pleine largeur, sans espace entre eux |
| Bento | Toute la page | Colonne de droite : tuiles à bord gris de 1 px, rayon 16 px |
| Nav | Panneau en verre, labels « Menu » / « Plus » | Pas de panneau. Texte 19 px, actif en gras, survol en pastille, une ligne entre les deux groupes. Compte en bas |
| Typo | Unbounded + Manrope | **Inter** seule (400 → 800). Titres de post en 800 / 18 px |
| Boutons | Perle / verre | Principal plein (blanc sur noir), secondaire à contour gris, fantôme |
| Onglets | Pastilles dans un creux | Texte, avec une barre de 4 px sous l'onglet actif |
| Actions des posts | Pastilles | Icône + chiffre, disque coloré au survol. Couleurs J'aime `#EC3F86` et Republier `#FFA834` conservées |
| Champs | Creux arrondis | Bord gris de 1 px, rayon 8 px. Au focus, le bord prend la couleur du texte |
| Avatars sans photo | Disque en verre | Disque gris uni |
| Sémantiques | `#3DDC97` / `#FF5C7A` / `#FFC857` | `#00BA7C` / `#F4212E` / `#FFD400` (plus francs, adaptés aux aplats) |

**Responsive** (même logique que la v8) :
- sous 1180 px, nav en icônes, recherche + rédaction + plugins en bande au-dessus du fil ;
- sous 720 px, barre de nav en bas, pleine largeur, avec une ligne en haut, au lieu de la pastille flottante.

**Avantage technique :** sans `backdrop-filter`, le rendu est bien plus léger, et le passage à Tailwind est quasi direct (bords, aplats, `divide-y`).

## En attente / à valider par aboumall

1. La direction globale : noir pur, lignes grises, aucune ombre.
2. Le fil en colonne bordée (style liste) alors que la colonne de droite reste en bento : cohérent ou pas ?
3. Inter seule, ou une police de titres plus marquée.
4. Les couleurs sémantiques plus franches.

## Prochaines étapes

- Retours sur la flat lines v1, et éventuellement d'autres directions dans leurs propres sous-dossiers de `docs/mockups/`.
- Choisir une direction, puis maquetter les autres écrans clés : page d'un post, profil, messages, paramètres, admin, connexion.
