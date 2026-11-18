# Design system : « Flat lines »

> **Version :** 0.3 (direction artistique retenue par aboumall)
> **Date :** 2026-11-11
> **Référence visuelle :** [mockups/flat-lines/v11.html](mockups/flat-lines/v11.html) (`?comments` ouvre les commentaires, `#ds` la planche de style, `?theme=light` le thème clair).
> **Palette et composants maquettés :** [mockups/flat-lines/design-system.html](mockups/flat-lines/design-system.html).
> **Module visé :** `web.design_system` (mineur, 1 pt) : *« Custom-made design system with reusable components, including a proper color palette, typography, and icons (minimum: 10 reusable components). »*
> **Spec technique :** [SPEC_TECH.md](SPEC_TECH.md) §11.5

> **Direction artistique retenue : flat lines** (2026-11-11). Le « liquid glass » (maquettes [liquid-glass/v1 à v8](mockups/liquid-glass/), [liquid-glass/design-system.html](mockups/liquid-glass/design-system.html)) était un test. Il est conservé pour l'historique, mais n'est plus la référence.

Ce document décrit la palette, la typographie, les autres fondations et les composants réutilisables du frontend. Les valeurs sont celles de la maquette flat lines v11. Une valeur marquée ⚠️ a été corrigée pour l'accessibilité par rapport à la v10 (§2.5). Ces corrections sont validées.

---

## Couverture du module `web.design_system`

| Exigence du sujet | Où |
|---|---|
| Palette de couleurs | §2 |
| Typographie | §3 |
| Icônes | §4.5 (Lucide) |
| Au moins 10 composants réutilisables | §5 : 25 composants, dont 13 au lot 1 |
| *(preuve en soutenance)* Documentation | Page `/design-system` de la SPA (§6), maquettée dans `mockups/flat-lines/design-system.html` |

---

## 1. Principes

1. **Monochrome.** L'interface est en noir, gris et blanc. La couleur est réservée à ce qui a un **sens** : liens, aimer, republier, en ligne, erreur, avertissement.
2. **Aplats et lignes.** Pas de verre, pas d'ombre, pas de dégradé. Les blocs sont séparés par des lignes grises de 1 px.
3. **Deux niveaux de surface.** Le contenu (nav, fil) est posé directement sur le fond de page. Les composants « posés » (tuiles, recherche, commentaires, menus, fenêtres) sont des **cartes** : un fond un peu plus clair que la page, avec un bord gris.
4. **Deux thèmes.** Sombre par défaut, clair en option. Tous les composants passent par les **tokens** (variables CSS), jamais par des couleurs en dur.
5. **Accessible.** Le texte respecte le contraste WCAG AA (4,5:1) sur le fond de page **et** sur les cartes. `prefers-reduced-motion` est respecté.

---

## 2. Palette de couleurs

### 2.1 Surfaces et lignes

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--bg` | `#16181C` | `#F3F5F7` | Fond de page |
| `--surface` | `#1D2025` | `#FFFFFF` | Fond d'un bloc au survol, creux |
| `--card` | `#202329` | `#FFFFFF` | Fond des cartes : tuiles, recherche, commentaires, menus, fenêtres |
| `--card-line` | `#3A3F47` | `#DBE2E7` | Bord des cartes |
| `--well` | `#16181C` | `#F3F5F7` | Creux dans une carte (champ « Ajouter un commentaire… ») |
| `--line` | `#33373D` | `#E4E9EC` | La ligne grise : séparations, nav, onglets |
| `--line-strong` | `#5B636D` | `#CFD9DE` | Bord des champs, boutons secondaires |
| `--avatar` | `#3A3F46` | `#DFE5E9` | Fond des avatars sans photo |

### 2.2 Texte, accent et liens

L'accent est la couleur du texte : le bouton principal est **blanc sur fond sombre** en thème sombre, **noir sur fond clair** en thème clair.

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--text` / `--accent` | `#E7E9EA` | `#0F1419` | Texte, titres, bouton principal, onglet actif |
| `--accent-ink` | `#16181C` | `#FFFFFF` | Texte posé sur l'accent (bouton principal, toast) |
| `--text-2` | `#9AA0A6` | `#4B5862` | Texte secondaire, « Répondre » |
| `--text-3` ⚠️ | `#8A9096` *(v10 : #80868C)* | `#5F6B74` *(v10 : #6B7780)* | @username, dates, compteurs |
| `--link` ⚠️ | `#4EA1FF` | `#1765C4` *(v10 : #1A6FD6)* | Mentions `@pseudo`, « Voir plus », « Voir N réponses », lien vers un post |

### 2.3 Couleurs fonctionnelles

Chaque couleur fonctionnelle a **une valeur par thème** (en v10, le thème clair reprenait celles du sombre).

| Token | Sombre | Clair | Sens |
|---|---|---|---|
| `--like` ⚠️ | `#F0508F` *(v10 : #EC3F86)* | `#C0185E` | J'aime (framboise pourpre) |
| `--repost` ⚠️ | `#FFA834` | `#B45309` *(v10 : #D97706)* | Republier (ambre orangé) |
| `--success` ⚠️ | `#00BA7C` | `#007A52` *(v10 : #00BA7C)* | En ligne, succès |
| `--danger` ⚠️ | `#FF5A64` *(v10 : #F4212E)* | `#C81E28` *(v10 : #F4212E)* | Texte d'erreur, action destructrice |
| `--danger-fill` (nouveau) | `#C81E28` | `#C81E28` | Fond du bouton Supprimer (texte blanc) |
| `--warning` ⚠️ | `#FFD400` | `#8A5A00` *(v10 : #FFD400)* | Avertissement, limite de caractères proche |

**États des actions J'aime / Republier :** au repos, l'icône et le compteur sont en `--text-3`. Au survol, ils prennent la couleur, avec un disque teinté derrière l'icône. Quand l'action est active, la couleur reste ; le cœur est rempli et l'icône de republication s'épaissit. Pas de pastille, pas de halo.

### 2.4 États

| Token | Sombre | Clair | Usage |
|---|---|---|---|
| `--hover` | `rgba(231,233,234,.07)` | `rgba(15,20,25,.05)` | Survol : nav, boutons, posts, commentaires |
| `--overlay` | `rgba(8,9,11,.66)` | `rgba(15,20,25,.4)` | Fond derrière les fenêtres modales |
| `--scroll-thumb` | `rgba(231,233,234,.3)` | `rgba(15,20,25,.25)` | Barre de défilement (visible seulement pendant le défilement) |

### 2.5 Contrastes (WCAG)

Les ratios sont donnés **sur le fond de page · sur une carte**. Seuil : **4,5:1** pour le texte, **3:1** pour les éléments non textuels.

| Couleur | Sombre | Clair |
|---|---|---|
| `--text` | 14,6 · 12,9 | 16,9 · 18,5 |
| `--text-2` | 6,7 · 6,0 | 6,7 · 7,3 |
| `--text-3` | 4,9 · 4,3 ❌ → **5,5 · 4,9** | 4,2 ❌ → **5,0 · 5,5** |
| `--link` | 6,7 · 5,9 | 4,5 de justesse → **5,2 · 5,7** |
| `--like` | 4,2 sur carte ❌ → **5,3 · 4,7** | 5,4 · 5,9 |
| `--repost` | 9,2 · 8,2 | 2,9 ❌ → **4,6 · 5,0** |
| `--success` | 7,0 · 6,2 | 2,3 ❌ → **4,9 · 5,4** |
| `--danger` | 3,8 sur carte ❌ → **5,8 · 5,2** | 3,8 ❌ → **5,2 · 5,7** |
| `--warning` | 12,4 · 11,0 | 1,3 ❌ → **5,4 · 5,9** |
| Texte blanc sur bouton Supprimer | 4,1 ❌ → **5,7** (fond `--danger-fill`) | idem |

**Bords des champs (`--line-strong`) :** 2,9:1 en sombre et 1,3:1 en clair, sous les 3:1 de WCAG 1.4.11. **Décision : on les garde tels quels**, pour la légèreté du style. Un champ reste identifiable par son libellé, son placeholder et, au focus, son bord de la couleur du texte.

---

## 3. Typographie

Une seule police : **Inter**, de 400 à 800. Gratuite (licence OFL), à **auto-héberger** dans le build pour ne pas dépendre de Google en production (RGPD).

| Rôle | Graisse | Taille | Usage |
|---|---|---|---|
| Display | 800 | 28 px | Titres de page, logo |
| Titre de page | 800 | 20 px | Titre de section, « Plugins » |
| Titre de post | 800 | 18 px, interligne 1,3 | Titre des posts |
| Titre de carte | 800 | 17 px | « Commentaires », en-têtes de carte |
| Nav | 400 (actif 700) | 19 px | Éléments de la nav |
| Chiffre | 800, chiffres tabulaires | 26 à 40 px | Chiffres des plugins (horloge, météo) |
| Texte de post | 400 | 15 px, interligne 1,5 | Contenu des posts |
| Commentaire | 400 | 14 px, interligne 1,45 | Texte des commentaires |
| Gras | 700 | — | Noms, boutons |
| Lien | 600, couleur `--link` | 13 à 15 px | Mentions, « Voir plus » |
| Légende | 400 | 13 px | @username, dates, compteurs |
| Sur-titre | 600 | 12 à 13 px, majuscules | Libellés « MÉTÉO », « COULEURS » |
| Code | `ui-monospace` | 0,88 em | Code inline dans les posts |

---

## 4. Autres fondations

### 4.1 Espacements

`4 · 8 · 12 · 16 · 20 · 24 px` (`--space-1` à `--space-6`). Entre les colonnes : 24 px.

### 4.2 Rayons

| Token | Valeur | Usage |
|---|---|---|
| `--r-sm` | 8 px | Champs, menus, toasts |
| `--r-md` | 16 px | Cartes, survol des posts, médias |
| `--r-pill` | 999 px | Boutons, nav, recherche, champ de commentaire |

### 4.3 Lignes

Toujours **1 px**. Dans le fil, les lignes entre les posts s'arrêtent à **20 px** des bords (16 px sur mobile, variable `--rule-inset`) ; elles disparaissent autour d'un post survolé. L'onglet actif est souligné d'une barre de **4 px**. Les éléments « ajouter » (plugin) ont un bord en tirets.

### 4.4 Mouvement

Courbe `cubic-bezier(.2, .8, .2, 1)`. Durées : 150 ms (survol, couleurs), 200 ms (interrupteur, icônes), 250 ms (ouverture du panneau des commentaires), 900 ms (délai avant de masquer la barre de défilement). Tout est coupé si `prefers-reduced-motion: reduce`.

### 4.5 Icônes

**Lucide** (`lucide-react`), trait 1,8 (2,4 pour l'élément actif). Tailles : 22 px par défaut, 18 px dans les boutons et les actions, 26 px dans la nav. Une icône seule dans un bouton a toujours un `aria-label`.

### 4.6 Mise en page et points de rupture

Largeurs : nav 275 px · fil 620 px · colonne de droite 360 px · commentaires 360 à 520 px.

| Largeur | Mise en page |
|---|---|
| ≥ 1500 px | Nav collée à gauche · fil et colonne de droite (recherche, rédaction, plugins) centrés dans l'espace restant. Commentaires ouverts : nav · fil · commentaires (centrés) · colonne de droite |
| 1181 à 1499 px | Idem, mais les commentaires ouverts remplacent la colonne de droite |
| ≤ 1180 px | Nav réduite aux icônes. Recherche, rédaction et plugins au-dessus du fil. Commentaires en tiroir à droite (420 px max) |
| ≤ 720 px | Une colonne, nav en barre en bas de l'écran, commentaires en plein écran |

Seuls le fil, les plugins et la liste des commentaires défilent (page fixe au-dessus de 1180 px).

---

## 5. Composants

**Lot 1** = les 13 composants qui suffisent à valider le module (minimum 10), à faire en S2-S3. **Statut** : ✅ maquetté (tous les composants le sont dans `mockups/flat-lines/design-system.html`, avec leurs variantes et leurs états).

### 5.1 Primitives

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 1 | `Panel` | Carte de base (tuiles, recherche, commentaires, menus, fenêtres) : fond `--card`, bord 1 px, sans ombre | `default` (16 px), `roomy` (24 px) ; `interactive` (survol), `dashed` (ajout) | `as`, `padding`, `interactive`, `dashed` | Toutes les pages | 1 | ✅ |
| 2 | `Button` | Action principale ou secondaire, forme « pill » | `primary` (plein), `outline` (contour gris), `ghost`, `danger` ; `sm`/`md`/`lg` ; `loading`, `disabled`, `block` | `variant`, `size`, `icon`, `loading` | Partout (NOTIF-03, POST, SOC, ADM) | 1 | ✅ |
| 3 | `IconButton` | Bouton rond avec une seule icône | `sm`/`md` ; `outline` ; point d'indication (`dot`) ; `disabled` | `icon`, `label` (obligatoire), `dot` | Rédaction, menus, nav réduite, en-têtes | 1 | ✅ |
| 4 | `Input` | Champ texte d'une ligne, bord gris, bord couleur du texte au focus | `default`, `error` + aide, `disabled` ; éléments à gauche ou à droite (mot de passe visible) | `label`, `hint`, `error`, `leading`, `trailing` | AUTH-01/02, ACC-03/05, SEARCH | 1 | ✅ |
| 5 | `Textarea` | Champ multi-lignes | compteur (avertissement près de la limite, erreur au-delà), hauteur automatique, `error` | `maxLength`, `showCount`, `autosize` | POST-01 (500), DM-01 (1 000), ACC-03 (bio, 160) | 1 | ✅ |
| 6 | `Avatar` | Photo de profil ou initiales sur disque gris uni | `xs` · `sm` · `md` · `lg` · `xl` ; point vert en ligne | `src`, `name`, `size`, `online` | Partout (ACC-01, ACC-04, ACC-07) | 1 | ✅ |
| 7 | `Badge` | Compteur ou étiquette | `count` (plein), `neutral`, `private` (cadenas), `danger` (contour) ; `99+` | `variant`, `max` | Nav (NOTIF-01, DM-02), profil (ACC-01), admin | 1 | ✅ |
| 8 | `Tabs` | Onglets en texte, barre de 4 px sous l'actif | sélectionné, survol ; `fill` ; navigation au clavier (flèches) | `items`, `value`, `onChange` | FEED-01/02, ACC-02, DM-03, recherche, admin | 1 | ✅ |
| 9 | `Switch` | Interrupteur on/off | on, off, `disabled` | `checked`, `onChange`, `label` | Thème, ACC-06 (compte privé) | 1 | ✅ |
| 10 | `ProgressBar` | Progression, barre fine de 4 px | déterminée, avec libellé, erreur | `value`, `label`, `error` | MEDIA-05 (upload) | 2 | ✅ |
| 11 | `Spinner` / `Skeleton` | Chargement | anneau ; squelettes de post, de ligne, d'avatar, de texte | `shape`, `lines` | UI-06, tous les chargements | 2 | ✅ |
| 12 | `Icon` | Habillage de Lucide aux tailles du système | 14 / 18 / 22 / 26 px | `name`, `size`, `label` | Partout | 1 | ✅ |

### 5.2 Retours et superpositions

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 13 | `Toast` + `ToastProvider` | Confirmation de chaque action : bloc inversé (fond couleur du texte), pastille de couleur pour le type | `success`, `error`, `info` (avec « Annuler ») ; fermeture auto (4 s) et manuelle | `type`, `message`, `action`, `duration` | **NOTIF-03** (toutes les créations, modifications, suppressions) | 1 | ✅ |
| 14 | `Modal` | Fenêtre de dialogue en carte, boutons empilés pleine largeur | confirmation, formulaire, `danger` ; piège du focus, Échap, retour du focus | `title`, `open`, `onClose`, `actions`, `variant` | Suppression (POST-07, ACC-09), bannissement (ADM-04), invitation visiteur (VIS-03), rédaction hors accueil | 1 | ✅ |
| 15 | `Dropdown` | Menu contextuel « … » en carte | éléments, séparateur, élément `danger` | `trigger`, `items` | Menu d'un post (POST-06/07, ADM-09), plugins, admin | 2 | ✅ |
| 16 | `EmptyState` | Liste vide | icône cerclée + titre + texte + action | `icon`, `title`, `description`, `action` | UI-06 (fil vide, aucune notification, aucun résultat) | 2 | ✅ |
| 17 | `ScrollArea` | Zone qui défile : barre native fine, sans fond, visible seulement pendant le défilement, fondu en bas | `fade`, `autoHide` | `fade`, `autoHide` | Fil, plugins, commentaires, messages, listes | 2 | ✅ |

### 5.3 Composants métier

| # | Composant | Rôle | Variantes / états | Props principales | Utilisé par (spec) | Lot | Statut |
|---|---|---|---|---|---|:-:|:-:|
| 18 | `PostCard` | Post façon Reddit, posé sur le fond : en-tête, titre, contenu tronqué à 4 lignes (« Voir plus »), médias, actions | normal, survol (fond arrondi), `(modifié)`, « republié par », **supprimé** / supprimé par la modération, réponse (sans titre), commentaires ouverts | `post`, `variant`, `context`, `deleted`, `open`, `onAction` | FEED-01/02, POST-01 à 08, ACC-02 | 1 | ✅ |
| 19 | `PostAction` | Icône + compteur, sans pastille | `reply`, `repost` (ambre), `like` (framboise) ; actif, survol (disque teinté), désactivé (post supprimé, compte privé : REPOST-03) | `kind`, `count`, `active`, `disabled` | LIKE-01, REPOST-01/03, POST-03 | 2 | ✅ |
| 20 | `MediaGrid` | Médias d'un post, bord 1 px | 1 à 4 images, GIF, 1 vidéo ; plein écran au clic | `media[]`, `onOpen` | MEDIA-02, MEDIA-08 | 2 | ✅ |
| 21 | `Composer` | Rédaction en carte | titre (obligatoire) + contenu (optionnel) + médias + compteurs ; mode réponse (sans titre) | `mode`, `replyTo`, `onSubmit`, `maxMedia` | POST-01, POST-03, MEDIA-04/05 | 2 | ✅ |
| 22 | `NavItem` / `Sidebar` | Navigation principale collée à gauche, ligne verticale, pas de panneau | actif (gras), badge, survol en pastille ; repliée (icônes) ; barre du bas sur mobile | `items`, `active`, `collapsed` | FEED-04, toutes les pages | 2 | ✅ |
| 23 | `UserListItem` | Ligne d'utilisateur | S'abonner / Demandé / Abonné / Accepter-Refuser ; statut en ligne ; action admin | `user`, `relation`, `action`, `admin` | SOC-01 à 06, SEARCH-01, ADM-01 | 2 | ✅ |
| 24 | `PluginTile` | Tuile de plugin en bento (iframe isolée) | tailles 1×2, 2×1, 2×2, 2×3 ; en-tête avec étiquette et menu ; « Ajouter un plugin » | `plugin`, `size` | Accueil (bento) | 3 | ✅ |
| 25 | `CommentsPanel` / `CommentItem` | Panneau des commentaires (réponses au sens de POST-03) d'un post, ouvert par sa bulle | en-tête (nombre, lien vers le post, fermer) ; commentaire (texte tronqué à 3 lignes, média, J'aime) ; fils repliables « Voir N réponses » / « Masquer » ; bandeau « En réponse à @… » ; champ en creux, envoi inactif si vide ; inséré entre fil et colonne de droite (≥ 1500 px), à la place de la colonne de droite (1181-1499 px), tiroir (≤ 1180 px) | `post`, `comments[]`, `open`, `onClose`, `onReply`, `onSubmit` | POST-03, POST-04, LIKE-01 | 2 | ✅ |

**Bilan :** 25 composants. Le **lot 1 en compte 13** : `Panel`, `Button`, `IconButton`, `Input`, `Textarea`, `Avatar`, `Badge`, `Tabs`, `Switch`, `Icon`, `Toast`, `Modal`, plus `PostCard`. Le minimum de 10 du module est donc couvert dès le lot 1. Lot 2 : 11 composants, lot 3 : 1.

---

## 6. Documentation dans la SPA

La page `/design-system` (lien « Design system » dans la nav) sert de preuve pour le module en soutenance :
- la palette, avec les deux thèmes et les ratios de contraste ;
- l'échelle typographique ;
- les icônes utilisées ;
- chaque composant, avec ses variantes, ses états et ses props.

La maquette `mockups/flat-lines/design-system.html` en est le point de départ. Storybook n'est pas nécessaire.

---

## 7. Passage au code (Tailwind)

Les tokens deviennent des variables CSS, et le thème Tailwind pointe vers elles. Le changement de thème se fait alors avec un seul attribut `data-theme` sur `<html>`. Le style flat lines passe presque directement en classes utilitaires (bords, aplats, `divide-y`) : aucun composant n'a besoin d'une classe CSS dédiée.

```css
/* src/design-system/tokens.css (extrait) */
@import "tailwindcss";

@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --radius-sm: 8px;
  --radius-md: 16px;
  --color-bg: var(--bg);
  --color-card: var(--card);
  --color-card-line: var(--card-line);
  --color-line: var(--line);
  --color-text: var(--text);
  --color-link: var(--link);
  --color-like: var(--like);
  --color-repost: var(--repost);
  --color-danger-fill: var(--danger-fill);
  /* … */
}

:root { --danger-fill: #c81e28; }

[data-theme="dark"] {
  --bg: #16181c;
  --card: #202329;
  --card-line: #3a3f47;
  --line: #33373d;
  --text: #e7e9ea;
  --text-3: #8a9096;
  --link: #4ea1ff;
  --like: #f0508f;
  --repost: #ffa834;
  --danger: #ff5a64;
  /* … */
}

[data-theme="light"] {
  --bg: #f3f5f7;
  --card: #ffffff;
  /* … */
}
```

---

## 8. Décisions validées

**2026-11-05 (toujours valables) :**
1. Le découpage en lots (§5).
2. La page `/design-system` comme documentation, sans Storybook.

**2026-11-11 :**
1. Direction artistique **flat lines**, à la place du liquid glass.
2. Les corrections de contraste marquées ⚠️ (§2.5) et le token `--danger-fill`, appliqués dans la maquette v11.
3. Les bords des champs gardent les valeurs de la v10 (sous 3:1), §2.5.
4. Le panneau des commentaires devient le composant **25** (`CommentsPanel` / `CommentItem`), au lot 2.
