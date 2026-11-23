# Tokens du design system dans le code (`front/feat/design-tokens`)

Branche créée depuis `front/chore/setup`, qui n'est pas encore fusionnée dans `frontend`.

## 1. Objectif

Passer les fondations de `DESIGN_SYSTEM.md` v0.5 (§2 à §4) dans le thème Tailwind, et donner au layout vide l'apparence des maquettes flat lines.

## 2. Fait

- **`frontend/src/design-system/tokens.css`** :
  - les couleurs des deux thèmes, reprises de `shell.css` et du §2 ;
  - Inter et les 9 tailles de texte du §3 ;
  - les rayons, la courbe `ease-flat` et les largeurs de colonnes (275 / 620 / 360 px, réduites sous 1 280 px) ;
  - les points de rupture du §4.6.
- La palette par défaut de Tailwind est retirée : seules les classes des tokens existent.
- **Thème** (`design-system/theme.ts`) :
  - `useTheme()` et `setTheme()` posent `data-theme` sur `<html>` et gardent le choix dans `localStorage` ;
  - un script dans `index.html` applique le thème avant le premier rendu.
- **Inter** est auto-hébergée (`@fontsource-variable/inter`), sans Google Fonts (RGPD, §3).
- **Base** (`index.css`) :
  - le corps de texte à 15 px ;
  - les titres en 800 ;
  - le focus visible de la couleur de l'accent ;
  - `code`, la sélection et la barre de défilement ;
  - `prefers-reduced-motion` respecté.
- **Mise en page des maquettes** (`app/layouts/`) :
  - `RootLayout` : une grille nav | marge | fil | colonne de droite | marge, qui suit les quatre mises en page du §4.6.
  - `Sidebar` : la nav des maquettes, en deux parties.
    - Liens : Accueil, Explorer, Notifications, Messages, Profil, puis une ligne, puis Design system, Administration et Paramètres.
    - En bas : l'interrupteur de thème et « Se connecter », puisqu'on est visiteur tant que l'auth n'existe pas.
  - Sur mobile, la nav devient une barre en bas de l'écran, et Recherche y prend la place de la colonne de droite.
  - Colonne de droite : la recherche (elle envoie vers `/search?q=…`) et les liens légaux. Sous 1 021 px, les liens légaux passent sous le contenu.
  - `PageHead` : l'en-tête collant des maquettes (titre 20 px, fond flouté, ligne à 20 px des bords).
  - `Brand` : la marque « t » et le nom.
  - `AuthLayout` : le logo, une colonne de 420 px, les liens légaux.
- **`/design-system`** : la page affiche les tokens (couleurs avec leur valeur dans le thème courant, typographie, rayons, espacements) et un bouton pour changer de thème. Les composants s'y ajouteront avec `front/feat/ds-showcase`.
- `DESIGN_SYSTEM.md` §7 : section « Dans le code » (classes disponibles, points de rupture, thème).

## 3. Vérifié

- `typecheck`, `lint`, `format:check` et `build` passent.
- Firefox headless :
  - captures à 1 440, 1 100, 900 et 390 px de large, en sombre et en clair ;
  - Inter est bien chargée ;
  - l'interrupteur change le thème, le choix est gardé dans `localStorage` et reste après un rechargement ;
  - **la console n'a aucune erreur ni aucun avertissement**.

## 4. Décisions

- Les **points de rupture** de Tailwind (`sm` à `2xl`) sont remplacés par ceux du §4.6, au lieu d'ajouter des noms à part. La spec technique (§11.6) parle déjà de `sm`, `md` et `lg`.
- `--overlay` reprend la valeur du design system (§2.4), et non le `--backdrop` de `shell.css`.

## 5. En attente / à valider

- **Sur mobile**, la barre du bas ne montre que les 6 liens principaux, comme dans les maquettes. Paramètres, Administration, Design system, le thème et « Se connecter » n'y sont pas. Il faudra un accès, sans doute par le Profil ou un menu, quand ces pages existeront.
- Le bouton « Publier » de la nav des maquettes n'est pas là : il arrivera avec la fenêtre de rédaction (S4).

## 6. Prochaines étapes

1. `front/feat/ds-base-components` : `Button`, `Input`, `Textarea`, `Avatar`, `Badge`, `Spinner`, `Modal`, `Toast`. Vitest et Testing Library arriveront avec eux.
2. `front/feat/ds-showcase` : les composants sur `/design-system`.
