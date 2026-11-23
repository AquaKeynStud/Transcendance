# 2026-11-23 : Panneau de réglages des maquettes, décisions sur l'authentification et la troncature

## Objectif

- Ajouter aux maquettes un panneau de debug pour modifier le contraste et d'autres réglages en direct, et mieux juger la palette.
- Noter les réponses d'aboumall aux questions ouvertes du rapport [2026-11-18_maquette-auth.md](2026-11-18_maquette-auth.md).

## Fait

- **`docs/mockups/flat-lines/debug-panel.js`** (nouveau), inclus dans `auth.html`. Bouton « Réglages » en bas à droite (à droite au-dessus du contenu sur mobile), `?debug` l'ouvre au chargement :
  - bascule sombre / clair, synchronisée avec l'interrupteur de la page ;
  - **contraste global** (40 à 180 %) : éloigne ou rapproche toutes les couleurs du fond ;
  - **un curseur de luminosité par token** (fond, carte, lignes, textes, lien, J'aime, Republier, succès, danger, avertissement). Chaque ligne affiche la valeur hex et le ratio WCAG sur le fond et sur la carte, en rouge sous le minimum (4,5:1 pour le texte, 3:1 pour le bord des champs). Un double-clic remet le token à sa valeur d'origine ;
  - **rayons** (0 à 200 %) ;
  - **vision** : protanopie, deutéranopie, tritanopie, niveaux de gris ;
  - « Réinitialiser ce thème » et « Copier le CSS » (copie les tokens modifiés, avec leur valeur d'origine en commentaire) ;
  - les réglages sont gardés par thème dans `localStorage`.
  - Le script est autonome : il suffit d'ajouter `<script src="debug-panel.js"></script>` pour le brancher sur `v11.html` ou `design-system.html`.
- **Nouveaux fonds** dans `v11.html`, `auth.html` et `design-system.html` (`--bg`, `--card`, `--well`, `--surface`, dans les deux thèmes). Les ratios des pastilles de `design-system.html` et du §2.5 de `DESIGN_SYSTEM.md` sont recalculés : tout le texte et toutes les couleurs restent au-dessus de 4,5:1, et le bord des champs en sombre passe à 3,2:1 sur le fond.
- **`auth.html`, écran `#verify`** : le texte « Vous pouvez déjà lire le fil Explorer en attendant » devient « Vous pourrez utiliser le site une fois votre adresse confirmée ».
- **`docs/DESIGN_SYSTEM.md` v0.5** :
  - §4.7 réécrit : le post entier tient dans 45 % du fil, et les médias ont une hauteur fixe, sauf si tous sont horizontaux ;
  - `MediaGrid` (20) : hauteur fixe, format horizontal si tous les médias sont horizontaux ;
  - §8 : décision du 2026-11-23.
- Vérifié :
  - captures Chrome headless (connexion en sombre, inscription en clair, visiteur, mobile 390 px) ;
  - script : le contraste et les curseurs changent les tokens, les ratios du thème clair correspondent à `DESIGN_SYSTEM.md` §2.5, et « Réinitialiser » retire toutes les surcharges.

## Décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Email non vérifié | **Il faut vérifier son email avant d'utiliser le site** après l'inscription | Choix d'aboumall (AUTH-04) |
| 2FA (AUTH-06) | Mise de côté, pas de maquette | On ne sait pas encore comment le backend la gérera |
| Troncature d'un post | Le **post entier** (en-tête, titre, médias, texte, actions) ne dépasse pas **45 %** de la hauteur visible du fil. Les médias ont une **hauteur fixe**, quel que soit leur nombre. Le texte prend la place qui reste | Choix d'aboumall |
| Médias horizontaux | Si **tous les médias sont horizontaux**, l'aperçu prend un format horizontal (16:9 proposé) au lieu de la hauteur fixe. S'il y a **au moins un média vertical**, l'aperçu garde la hauteur fixe et les horizontaux se calent dessus (recadrés) | Choix d'aboumall : un média horizontal ne doit pas être affiché dans un cadre vertical |
| Fonds | **`#0D0F11`** en sombre (au lieu de `#16181C`), **`#FFFFFF`** en clair (au lieu de `#F3F5F7`). Les cartes gardent le même écart avec le fond (≈ 1,1:1) : `#1A1C21` en sombre, `#F3F5F7` en clair. `--well` suit le fond, `--surface` prend la valeur de la carte. Les autres couleurs ne changent pas | Choix d'aboumall, fait avec le panneau de réglages. `--surface` valait `#FFFFFF` en clair (invisible sur le fond blanc) |
| Case à cocher et alerte en ligne | Pas encore dans le design system : elles n'existent que dans `auth.html` | En attente de la réponse d'aboumall |

## En attente / à valider par aboumall

1. **Case à cocher et alerte en ligne** : les ajouter au design system comme composants 26 (`Checkbox`) et 27 (`Alert`) ? Elles n'existent pour l'instant que dans `auth.html` :
   - la case sert pour les CGU de l'inscription ;
   - l'alerte sert pour l'erreur et le blocage de la connexion, et pour « Mot de passe modifié ».
2. **Troncature avec médias** : avec des médias de 260 px, un écran de 1080 px ne laisse presque pas de place au texte (voir le tableau de `DESIGN_SYSTEM.md` §4.7). Il faut choisir entre :
   - a. 3 lignes minimum, avec un dépassement à environ 50 % ;
   - b. aucune ligne, seulement « Voir plus » ;
   - c. des médias plus bas (200 px).
3. Les commentaires gardent l'ancienne règle (30 %, texte et médias seulement). Faut-il leur appliquer la même logique « élément entier » ?
4. **Format des aperçus horizontaux** : 16:9 proposé. Avec ce format, un post à 1080 px n'a plus de place pour le texte (environ 57 % avec 3 lignes minimum, voir `DESIGN_SYSTEM.md` §4.7). Un format plus large (2:1, 21:9) en laisse un peu plus, mais recadre davantage les photos en 4:3 ou 3:2. Un carré compte comme vertical : à confirmer.
5. La hauteur des médias n'est pas la même partout : 260 px dans la v11 et 240 px dans `auth.html`, mais 200 px sur la page du design system. Une seule valeur sera retenue une fois le point 2 tranché.
6. Faut-il une connexion « compte non vérifié » ? Avec la décision sur l'email, un compte non vérifié qui se connecte devrait voir un message et un bouton « Renvoyer l'email ». Ce cas n'est pas encore maquetté.

## Prochaines étapes

- Brancher le panneau de réglages sur `v11.html` et `design-system.html`, si aboumall le veut.
- Trancher les points ci-dessus, puis passer à la maquette du **profil**.
