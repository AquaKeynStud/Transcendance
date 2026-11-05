# Design system : « Liquid glass »

> **Version :** 0.2 (validée par aboumall)
> **Date :** 2026-11-05
> **Référence visuelle :** [mockups/liquid-glass-v8.html](mockups/liquid-glass-v8.html) (validée).
> **Palette et composants maquettés :** [mockups/design-system.html](mockups/design-system.html) (`?theme=light` pour le thème clair).
> **Module visé :** `web.design_system` (mineur, 1 pt) : *« Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components). »*
> **Spec technique :** [SPEC_TECH.md](SPEC_TECH.md) §11.5

> ⚠️ **Statut : exploration, direction artistique non définitive.** Le « liquid glass » est un **test**. aboumall est satisfait de la maquette v8, mais ce style n'est peut-être pas adapté à un réseau social. D'autres maquettes avec d'autres thèmes viendront plus tard. Ce qui ne dépend pas du thème restera valable quel que soit le style retenu : la liste des composants (§5), leurs variantes et états, leurs props et le lien avec la spec. Les couleurs, matières et polices pourront changer.

Ce document décrit la palette, la typographie, les autres fondations et les composants réutilisables du frontend. Les valeurs viennent de la maquette v8. Une valeur marquée ⚠️ a été corrigée pour l'accessibilité par rapport à la v8 (§2.6). Ces corrections sont validées et appliquées dans `design-system.html`.

---

## Couverture du module `web.design_system`

| Exigence du sujet | Où |
|---|---|
| Palette de couleurs | §2 |
| Typographie | §3 |
| Icônes | §4.4 (Lucide) |
| Au moins 10 composants réutilisables | §5 : 24 composants, dont 13 au lot 1 |
| *(preuve en soutenance)* Documentation | Page `/design-system` de la SPA (§6), maquettée dans `mockups/design-system.html` |

---

## 1. Principes

1. **Monochrome.** L'interface est en blanc, gris et noir. La couleur est réservée à ce qui a un **sens** : aimer, republier, en ligne, erreur, avertissement.
2. **Verre liquide.** Les surfaces sont translucides et floutées, avec un bord fin plus brillant aux coins. Le contenu (texte, images) n'est jamais en verre.
3. **Peu de verre à la fois.** `backdrop-filter` coûte cher : le verre est réservé aux grandes surfaces (nav, tuiles, fenêtres). Un post dans le fil n'est pas une surface de verre, seule la tuile du fil l'est.
4. **Deux thèmes.** Sombre par défaut, clair en option. Tous les composants passent par les **tokens** (variables CSS), jamais par des couleurs en dur.
5. **Accessible.** Le texte respecte le contraste WCAG AA. `prefers-reduced-motion` et `prefers-reduced-transparency` sont respectés.

---

## 2. Palette de couleurs

### 2.1 Neutres

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--bg` | `#111214` | `#DADCDF` | Fond de page |
| `--text` | `#F4F5F7` | `#0C0D0F` | Texte principal, titres |
| `--text-2` | `rgba(244,245,247,.66)` | `rgba(12,13,15,.66)` | Texte secondaire (contenu des posts, libellés) |
| `--text-3` ⚠️ | `rgba(244,245,247,.52)` *(v8 : .42)* | `rgba(12,13,15,.58)` *(v8 : .45)* | Texte tertiaire (@username, dates, compteurs) |
| `--line` | `rgba(255,255,255,.09)` | `rgba(12,13,15,.08)` | Séparateurs |
| `--well` | `rgba(0,0,0,.28)` | `rgba(255,255,255,.45)` | Creux : champs, onglets, pastilles d'action |
| `--well-edge` | `rgba(255,255,255,.09)` | `rgba(12,13,15,.10)` | Bord des creux |
| — | `#8D939B` | `#8D939B` | Gris moyen (barres de progression, éléments décoratifs) |

### 2.2 Accent

En sombre, l'accent est un **blanc perle**. En clair, c'est un **graphite**.

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--accent` | `#FFFFFF` | `#15171A` | Anneau de focus, éléments actifs |
| `--accent-fill` | dégradé `#FFFFFF → #E4E7EB → #AEB4BC` | dégradé `#4A4F56 → #24272B → #0C0D0F` | Bouton principal, badges de compteur |
| `--accent-ink` | `#0B0C0E` | `#FFFFFF` | Texte posé sur `--accent-fill` |
| `--accent-soft` | `rgba(255,255,255,.14)` | `rgba(12,13,15,.12)` | Halo de focus des champs |

### 2.3 Couleurs fonctionnelles

| Token | Sombre | Clair | Sens |
|---|---|---|---|
| `--like` ⚠️ | `#F0508F` *(v8 : #EC3F86)* | `#C0185E` | J'aime (framboise pourpre) |
| `--repost` ⚠️ | `#FFA834` | `#A8530A` *(v8 : #D97706)* | Republier (ambre orangé) |
| `--success` ⚠️ | `#3DDC97` | `#12985F` *(v8 : #3DDC97)* | En ligne, succès |
| `--danger` ⚠️ | `#FF5C7A` | `#C42347` *(v8 : #FF5C7A)* | Erreur, suppression |
| `--warning` ⚠️ | `#FFC857` | `#92600A` *(v8 : #FFC857)* | Avertissement |

**États des actions J'aime / Republier :** au repos l'action est en `--text-2`. Au survol, l'icône et le chiffre prennent la couleur. Quand l'action est active, on ajoute un fond `color-mix(couleur 14 %)` et un bord `color-mix(couleur 38 %)`, sans halo. Le cœur est rempli et l'icône de republication s'épaissit (trait 2,3).

### 2.4 Matières

| Token | Sombre | Clair | Rôle |
|---|---|---|---|
| `--glass-fill` | dégradé 140° blanc `.10 → .045 → .065` | dégradé 140° blanc `.72 → .38 → .55` | Remplissage du verre |
| `--glass-edge` | dégradé 140° blanc `.75 → .12 → .03 → .10 → .55` | dégradé 140° blanc `1 → .5 → .2 → .9` | Bord de 1 px, plus brillant aux coins (masque `content-box`) |
| `--glass-shadow` | `0 24px 60px -24px rgba(0,0,0,.7)` + reflets intérieurs haut/bas | `0 24px 50px -28px rgba(20,22,26,.55)` + reflets | Profondeur |
| `--blur` | `22px` + `saturate(160%)` | idem | Flou de l'arrière-plan |
| `--chrome` | dégradé 160° `#FFF → #CFD3D8 → #5F646B → #ECEEF1 → #8F949B → #2C2F33` | version claire | Logo, curseur des interrupteurs, pochettes |
| `--post-hover` | `rgba(255,255,255,.055)` + bord `.08` | `rgba(255,255,255,.6)` + bord `.9` | Survol d'un post |
| `--scroll-thumb` | `rgba(255,255,255,.32)` | `rgba(12,13,15,.3)` | Barre de défilement (visible seulement pendant le défilement) |

**Réfraction (optionnelle, Chrome) :** filtre SVG `feTurbulence` + `feDisplacementMap` dans `backdrop-filter` sur les boutons « pill ». Si le navigateur ne le gère pas, on retombe sur un simple flou.

### 2.5 Avatars sans photo

Pas de couleur : un cercle de verre (`radial-gradient` blanc `.22 → .04 → .10`) et les initiales en blanc, en Unbounded 600, à 38 % du diamètre. En thème clair, les initiales sont en `--text`.

### 2.6 Contrastes (WCAG)

Les contrastes sont mesurés sur une tuile de verre : environ `#202123` en sombre et `#EEEFF1` en clair. Le seuil est de **4,5:1** pour le texte et de **3:1** pour les éléments non textuels (points, icônes seules).

| Couleur | Sombre (v8 → corrigé) | Clair (v8 → corrigé) |
|---|---|---|
| `--text` | 14,8 | 16,9 |
| `--text-2` | 7,2 | 6,0 |
| `--text-3` | 3,8 ❌ → **5,0** | 3,0 ❌ → **4,6** |
| `--like` | 4,3 ❌ → **4,8** | 5,2 |
| `--repost` | 8,4 | 2,8 ❌ → **4,7** |
| `--success` (point, 3:1) | 9,1 | 1,5 ❌ → **3,2** |
| `--danger` | 5,4 | 2,6 ❌ → **5,0** |
| `--warning` | 10,5 | 1,3 ❌ → **4,7** |
| Texte blanc sur bouton Supprimer | 3,0 ❌ → **4,7** (fond `#E04A68 → #C92A4A`) | idem |

**Conséquence :** en thème clair, les couleurs fonctionnelles de la v8 étaient celles du thème sombre. Elles reçoivent leurs propres valeurs, plus foncées. En sombre, les corrections sont à peine visibles.

---

## 3. Typographie

Deux polices gratuites (Google Fonts, licence OFL), à **auto-héberger** dans le build pour ne pas dépendre de Google en production (RGPD).

| Rôle | Police | Graisse | Taille | Usage |
|---|---|---|---|---|
| Display | Unbounded | 700 | 28 px | Titres de page, logo (16 px) |
| Titre | Unbounded | 600 | 20 px | Titre de section, chiffres des plugins (26 à 40 px) |
| Titre de post | Unbounded | 600 | 19 px (17 px sur mobile) | Titre des posts |
| Sous-titre | Unbounded | 600 | 15 px | Titres de tuiles (Fil, Plugins) |
| Texte de post | Manrope | 500 | 15 px, interligne 1,6 | Contenu des posts |
| Texte | Manrope | 500 | 14 px, interligne 1,45 | Interface |
| Gras | Manrope | 700 à 800 | — | Noms, boutons, onglets |
| Légende | Manrope | 500 | 12 à 13 px | @username, dates, compteurs |
| Sur-titre | Manrope | 500 | 11 à 13 px, majuscules, espacement .08 à .14 em | Libellés « MENU », « MÉTÉO » |
| Code | `ui-monospace` | — | 0,88 em | Code inline dans les posts |

Unbounded est réservée aux titres et aux chiffres : elle est trop large pour du texte courant.

---

## 4. Autres fondations

### 4.1 Espacements

`4 · 8 · 12 · 16 · 24 · 32 px` (`--space-1` à `--space-6`). Marge de page : `28 px` (14 px sur mobile). Espace entre les blocs : `20 px` (14 px sur mobile).

### 4.2 Rayons

| Token | Valeur | Usage |
|---|---|---|
| `--r-sm` | 12 px | Éléments de nav, petits creux |
| `--r-md` | 18 px | Champs multi-lignes, posts, médias |
| `--r-lg` | 28 px | Tuiles, nav, fenêtres |
| `--r-pill` | 999 px | Boutons, champs, onglets, badges |

### 4.3 Mouvement

Courbe `cubic-bezier(.2, .8, .2, 1)`. Durées : 150 ms (clic), 200 ms (survol), 250 ms (interrupteur), 350 ms (barre de défilement), 400 ms (changement de thème). Tout est coupé si `prefers-reduced-motion: reduce`.

### 4.4 Icônes

**Lucide** (`lucide-react`), trait 1,7, en 20 px (16 px dans les boutons et les pastilles). Une icône seule dans un bouton a toujours un `aria-label`.

### 4.5 Points de rupture

| Largeur | Mise en page |
|---|---|
| > 1180 px | 3 colonnes : nav · fil · recherche + rédaction + plugins. Seuls le fil et les plugins défilent |
| ≤ 1180 px | Nav réduite aux icônes. Recherche, rédaction et bande de plugins horizontale au-dessus du fil. La page défile |
| ≤ 720 px | Une colonne, nav en barre en bas de l'écran |

---

## 5. Composants

**Lot 1** = les 13 composants qui suffisent à valider le module (minimum 10), à faire en S2-S3. **Statut** : ✅ maquetté (tous les composants le sont dans `mockups/design-system.html`, avec leurs variantes et leurs états).

### 5.1 Primitives

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 1 | `GlassPanel` | Surface de verre de base (tuiles, nav, fenêtres) | `default`, `compact`, `dashed` (ajout) ; `interactive` (survol) | `as`, `padding`, `radius` | Toutes les pages | 1 | ✅ |
| 2 | `Button` | Action principale ou secondaire | `primary`, `glass`, `ghost`, `danger` ; `sm`/`md` ; `loading`, `disabled`, `block` ; réfraction optionnelle | `variant`, `size`, `icon`, `loading` | Partout (NOTIF-03, POST, SOC) | 1 | ✅ |
| 3 | `IconButton` | Bouton rond avec une seule icône | `sm`/`md` ; point d'indication (`dot`) | `icon`, `label` (obligatoire), `dot` | Rédaction, menus, nav réduite | 1 | ✅ |
| 4 | `Input` | Champ texte d'une ligne | `default`, `error` + aide, `disabled` ; icône ou bouton à droite (mot de passe visible) | `label`, `error`, `hint`, `leading`, `trailing` | AUTH, ACC, SEARCH | 1 | ✅ |
| 5 | `Textarea` | Champ multi-lignes | compteur de caractères, hauteur automatique, `error` | `maxLength`, `showCount`, `autosize` | POST-01, DM-01, ACC-03 (bio) | 1 | ✅ |
| 6 | `Avatar` | Photo de profil ou initiales sur verre | `xs` 28 · `sm` 34 · `md` 40 · `lg` 56 · `xl` 72 ; statut en ligne | `src`, `name`, `size`, `online` | Partout (ACC-01, ACC-04, ACC-07) | 1 | ✅ |
| 7 | `Badge` | Compteur ou étiquette | `count` (accent), `neutral`, `private` (cadenas) | `variant`, `children` | Nav, profil (ACC-01), NOTIF-01, DM-02 | 1 | ✅ |
| 8 | `Tabs` | Onglets segmentés | sélectionné, survol ; navigation au clavier (flèches) | `items`, `value`, `onChange` | Fil (FEED-01/02), profil (ACC-02), messages (DM-03), recherche | 1 | ✅ |
| 9 | `Switch` | Interrupteur on/off | on, off, `disabled` | `checked`, `onChange`, `label` | Thème, compte privé (ACC-06) | 1 | ✅ |
| 10 | `ProgressBar` | Progression | déterminée, avec libellé | `value`, `label` | Upload de médias (MEDIA-05) | 2 | ✅ |
| 11 | `Spinner` / `Skeleton` | Chargement | spinner ; squelettes de post, de ligne, d'avatar | `shape`, `lines` | UI-06, tous les chargements | 2 | ✅ |
| 12 | `Icon` | Habillage de Lucide aux tailles du système | 16 / 20 px | `name`, `size` | Partout | 1 | ✅ |

### 5.2 Retours et superpositions

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 13 | `Toast` + `ToastProvider` | Confirmation de chaque action | `success`, `error`, `info` ; fermeture auto (4 s) et manuelle | `type`, `message`, `action` | **NOTIF-03** (toutes les créations, modifications, suppressions) | 1 | ✅ |
| 14 | `Modal` | Fenêtre de dialogue | confirmation, formulaire, `danger` ; piège du focus, Échap, retour du focus | `title`, `open`, `onClose`, `actions` | Suppression (POST-07, ACC-09), bannissement (ADM-04), invitation visiteur (VIS-03), rédaction hors accueil | 1 | ✅ |
| 15 | `Dropdown` | Menu contextuel « … » | éléments, séparateur, élément `danger` | `items`, `trigger` | Menu d'un post (modifier, supprimer, signaler), plugins | 2 | ✅ |
| 16 | `EmptyState` | Liste vide | icône + texte + action | `icon`, `title`, `action` | UI-06 (fil vide, aucune notification, aucun résultat) | 2 | ✅ |
| 17 | `ScrollArea` | Zone qui défile avec barre masquée au repos et fondu en bas | `fade` | `fade`, `autoHide` | Fil, plugins, messages | 2 | ✅ |

### 5.3 Composants métier

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 18 | `PostCard` | Post façon Reddit : en-tête, titre, contenu, médias, actions | normal, survol, `(modifié)`, « republié par », **supprimé** / supprimé par la modération, réponse (sans titre) | `post`, `context`, `onAction` | FEED, POST-04, ACC-02 | 1 | ✅ |
| 19 | `PostAction` | Pastille d'action avec compteur | `reply`, `repost` (ambre), `like` (framboise) ; actif, survol, désactivé (post supprimé, compte privé : REPOST-03) | `kind`, `count`, `active` | PostCard (LIKE, REPOST) | 2 | ✅ |
| 20 | `MediaGrid` | Médias d'un post | 1 à 4 images, GIF, 1 vidéo ; plein écran au clic | `media[]` | MEDIA-08 | 2 | ✅ |
| 21 | `Composer` | Rédaction d'un post | titre (obligatoire) + contenu (optionnel) + médias + compteurs ; mode réponse (sans titre) | `mode`, `onSubmit` | POST-01, POST-03, MEDIA-04 | 2 | ✅ |
| 22 | `NavItem` / `Sidebar` | Navigation principale | actif, badge ; replié (icônes) ; barre du bas sur mobile | `items`, `active` | FEED-04, toutes les pages | 2 | ✅ |
| 23 | `UserListItem` | Ligne d'utilisateur | avec bouton S'abonner / Demandé / Abonné ; statut en ligne | `user`, `action` | SOC-06, recherche, admin (ADM-01) | 2 | ✅ |
| 24 | `PluginTile` | Tuile de plugin (iframe isolée) | tailles 1×2, 2×1, 2×2, 2×3 ; en-tête avec étiquette et menu ; « Ajouter un plugin » | `plugin`, `size` | Accueil (bento) | 3 | ✅ |

**Bilan :** 24 composants. Le **lot 1 en compte 13** : `GlassPanel`, `Button`, `IconButton`, `Input`, `Textarea`, `Avatar`, `Badge`, `Tabs`, `Switch`, `Icon`, `Toast`, `Modal`, plus `PostCard`. Le minimum de 10 du module est donc couvert dès le lot 1.

---

## 6. Documentation dans la SPA

La page `/design-system` (lien « Design system » dans la nav) sert de preuve pour le module en soutenance :
- la palette, avec les deux thèmes et les ratios de contraste ;
- l'échelle typographique ;
- les icônes utilisées ;
- chaque composant, avec ses variantes, ses états et ses props.

La maquette v8 (`#ds`) en est le point de départ. Storybook n'est pas nécessaire.

---

## 7. Passage au code (Tailwind)

Les tokens deviennent des variables CSS, et le thème Tailwind pointe vers elles. Le changement de thème se fait alors avec un seul attribut `data-theme` sur `<html>`.

```css
/* src/design-system/tokens.css (extrait) */
@import "tailwindcss";

@theme {
  --font-display: "Unbounded", system-ui, sans-serif;
  --font-body: "Manrope", system-ui, sans-serif;
  --radius-sm: 12px;
  --radius-md: 18px;
  --radius-lg: 28px;
  --color-bg: var(--bg);
  --color-text: var(--text);
  --color-like: var(--like);
  --color-repost: var(--repost);
  /* … */
}

[data-theme="dark"] {
  --bg: #111214;
  --text: #f4f5f7;
  --like: #f0508f;
  --repost: #ffa834;
  /* … */
}
```

Le verre (`glass-fill`, `glass-edge`, flou) n'entre pas bien dans des classes utilitaires : il devient le composant `GlassPanel`, avec une classe CSS dédiée.

---

## 8. Décisions validées (2026-11-05)

1. Les corrections de contraste marquées ⚠️ (§2.6), dans les deux thèmes.
2. Le découpage en lots (§5).
3. La page `/design-system` comme documentation, sans Storybook.
