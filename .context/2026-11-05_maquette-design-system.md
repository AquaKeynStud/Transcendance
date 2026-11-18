# 2026-11-05 : Maquette du design system (palette + 24 composants)

## Objectif

aboumall a validé le doc du design system (corrections de contraste, lots, page `/design-system` sans Storybook). Avant le setup du front, il faut maquetter **tous** les composants dans un seul fichier HTML, avec la palette de couleurs du site.

## Fait

- **`docs/mockups/liquid-glass/design-system.html`** (branche `front/chore/design-system`) : une page autonome qui préfigure la page `/design-system` de la SPA.
  - **Couleurs** : les deux thèmes côte à côte (sombre et clair), avec les **valeurs corrigées** (contraste). Chaque couleur montre son token, sa valeur, son usage et son ratio de contraste WCAG. Groupes : neutres, accent, couleurs fonctionnelles, matières (verre, survol, fond des fenêtres).
  - **Typographie** : l'échelle complète (Unbounded + Manrope).
  - **Fondations** : espacements, rayons, mouvement.
  - **Les 24 composants**, numérotés comme dans `DESIGN_SYSTEM.md` §5, chacun avec ses variantes, ses états, ses props principales et les IDs de la spec qui l'utilisent.
  - Bascule de thème dans l'en-tête, `?theme=light` pour forcer le thème clair, `?scrolling` pour afficher les barres de défilement.
- **Composants maquettés pour la première fois :** Spinner / Skeleton, EmptyState, Dropdown (menu « … » ouvert), UserListItem (S'abonner, Demandé, Abonné, Accepter/Refuser, Bannir), post en mode réponse (fil sans titre), post supprimé par la modération, post de compte privé (republication désactivée), MediaGrid (1 à 4 images, vidéo, GIF, plein écran), Composer (médias en cours d'envoi, erreur de titre, mode réponse), Modal (confirmation de suppression + invitation visiteur VIS-03), Toast (succès, info avec « Annuler », erreur), sidebar repliée et barre du bas mobile, états désactivé et chargement des boutons, champ avec libellé, focus et désactivé, compteur de caractères proche de la limite ou dépassé.
- **`docs/DESIGN_SYSTEM.md`** passe en v0.2 : corrections de contraste validées, tous les composants marqués ✅, lien vers la page de maquette, §8 renommé « Décisions validées ».
- Vérifié avec des captures de Chrome headless, page entière, en sombre et en clair.

## Comment la page est construite

La page est générée par un petit script Python (gardé hors du repo). Il reprend **tels quels** les styles de la maquette v8 (verre, boutons, champs, posts, actions…) et y ajoute les tokens corrigés et les styles des nouveaux composants. La page reste ainsi fidèle à la v8 validée.

## Incident

Le dossier personnel (`/home/aboumall`, 9,4 Go) était plein à 100 % (196 Ko libres), et l'écriture de la page a d'abord échoué. Les plus gros dossiers sont `.vscode` (2,5 Go), `.config/discord` (1,7 Go), `.config/Code` (1,3 Go) et `Downloads` (1,3 Go). Rien n'a été supprimé. La page a été générée dans le scratchpad (`/tmp`), puis copiée dans le repo une fois 238 Mo libérés.

## En attente / à valider par aboumall

1. La page de maquette des composants.

## Prochaines étapes

- Après validation : fusionner `front/chore/design-system` dans `frontend`.
- Sprint S2 : setup du front (`front/chore/setup`), puis les tokens (`front/feat/design-tokens`) et les composants du lot 1 (`front/feat/ds-base-components`).
