# 2026-11-05 : Maquette v1, DA « liquid glass » + accueil bento

## Objectif

Tester la direction artistique demandée par aboumall : composants en verre liquide, page d'accueil en bento, navigation à gauche. Sert de base à valider avant les maquettes détaillées et le code.

## Fait

- Moodboard d'aboumall rangé dans `.context/inspirations/2026-11-05_moodboard-liquid-glass.jpg` (compressé de 5,5 Mo à 330 Ko).
- Maquette HTML/CSS autonome : `docs/mockups/liquid-glass/v1.html` (branche `front/chore/mockups`).
  - Ouvrir le fichier dans Chrome. `#ds` affiche la planche de style, `?theme=light` force le thème clair.
  - **Accueil (bento)** : rédaction, carte profil, fil (onglets Abonnements / Explorer, post avec média, republication, « (modifié) », « Post supprimé »), plugin Météo, notifications, messages, amis en ligne, plugin Snake, tuile « Ajouter un plugin ».
  - **Nav gauche** : profil, menu avec badges, section Plus (Plugins, Design system, Administration, Paramètres), bouton Publier, bascule de thème, déconnexion.
  - **Planche de style** : couleurs, typo, boutons, champs (avec état d'erreur), onglets, interrupteurs, barre de progression, avatars, badges, toast, fenêtre modale.
  - **Responsive** : 12 colonnes au-dessus de 1280 px, 6 colonnes en dessous, nav réduite aux icônes sous 1024 px, nav en barre du bas et une colonne sous 720 px.
- Vérifiée avec des captures de Chrome headless : sombre et clair à 1440 px, planche de style, mobile à 400 px.

**Pourquoi du HTML et pas Framer ?** Framer n'est pas encore connecté à Claude Code (plugin MCP Unframer à configurer). La maquette HTML permet de valider la DA tout de suite. Les tokens et les recettes CSS seront réutilisés tels quels dans le thème Tailwind.

## Décisions de DA (proposées)

| Élément | Choix | Tiré du moodboard |
|---|---|---|
| Fond | Noir profond `#040507` + rubans de lumière chrome/bleu flous et animés lentement | Vagues chrome, lames lumineuses |
| Verre | Remplissage blanc 3 à 11 %, `backdrop-filter: blur(22px) saturate(170%)`, bord 1 px en dégradé plus brillant aux coins, reflet intérieur en haut | Cartes et pills en verre |
| Réfraction | Filtre SVG (`feDisplacementMap`) sur les boutons « pill », Chrome uniquement, avec repli sur un simple flou | « Liquid glass » |
| Chrome | Dégradé argent pour le logo, l'anneau des avatars et le curseur des interrupteurs | Icônes 3D chrome (avion, engrenage) |
| Accent | Bleu glacier `#5AB8FF` / `#2F9BFF` | Reflets bleus du ruban |
| Sémantiques | Succès `#3DDC97`, erreur `#FF5C7A`, avertissement `#FFC857` | — |
| Typo | Jost (titres, géométrique) + Inter (texte) | Menu « Chisa », écran Login |
| Rayons | 12 / 18 / 28 px, pills à 999 px | Formes très arrondies |
| Thème clair | Argent givré `#D9DDE4`, verre blanc 40 à 70 % | Toggle « Light » |

## Points d'attention

- **Performance** : `backdrop-filter` coûte cher. Limiter le nombre de surfaces en verre visibles, pas de verre dans les listes longues (chaque post n'est pas en verre, seule la tuile l'est).
- **Accessibilité** : texte toujours sur un verre assez opaque, `prefers-reduced-transparency` et `prefers-reduced-motion` gérés.
- **Le fil dans une tuile** défile à l'intérieur de la tuile. À trancher : défilement interne (effet « dashboard ») ou page entière qui défile.
- Le sujet impose seulement Chrome (`GR4`) : la réfraction SVG est donc acceptable.

## En attente / à valider par aboumall

1. La DA globale (fond, verre, chrome, accent bleu).
2. La composition du bento et la taille des tuiles.
3. Le défilement du fil (interne ou page).
4. La typo Jost + Inter.
5. Le thème clair : à garder ou non.

## Prochaines étapes

- Corrections selon les retours, puis v2.
- Ensuite, les autres écrans clés : page d'un post, profil, messages, paramètres, admin, connexion.
- Connecter Framer si on veut y reporter la DA validée.
