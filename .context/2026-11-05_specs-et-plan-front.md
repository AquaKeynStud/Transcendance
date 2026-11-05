# 2026-11-05 : Specs, plan du front et branches

## Objectif

Démarrer la partie frontend (sprint S1) : savoir quoi construire, avec quels choix techniques, et dans quel ordre.

## Fait

- **Spec fonctionnelle** `docs/SPEC_FONC.md` (v0.3) versionnée sur `master` (commit `d89f589`).
- **Spec technique** `docs/SPEC_TECH.md` (v0.1) créée et poussée sur `master` (même commit) :
  - partie commune (§1 à §7) : architecture, authentification, conventions de l'API, contrat WebSocket, médias, qualité ;
  - sections par partie (§8 à §11) : seule la section frontend (§11) est remplie, les autres sont des squelettes.
- **Plan du front** `docs/FRONT_PLAN.md` : branches et contenu de chaque sprint S1 → S11, composants du design system.
- **Branche `frontend`** créée depuis `master`, branche d'intégration du front.
- **Dossier `.context/`** créé pour les rapports.

## Décisions

| Sujet | Décision | Pourquoi |
|---|---|---|
| Une spec technique commune ou par partie ? | Un seul `SPEC_TECH.md`, partie commune + une section par partie | Les contrats entre parties (auth, API, WS) doivent être définis une fois |
| Nom de la branche d'intégration | `frontend`, sous-branches `front/feat|fix|chore/<sujet>` | Git refuse une branche `front` et des branches `front/...` en même temps |
| Framework CSS | Tailwind | Exigé par `TR1`/`TR2` (0 pt) ; sert de base au design system |
| Module bonus `web.design_system` | Visé (mineur, 1 pt) | Le sujet demande une palette, une typo, des icônes et au moins 10 composants réutilisables ; ils sont faits de toute façon |
| Outil de maquettes | Framer (plan gratuit) | Suffisant pour des maquettes ; on ne publie pas de site dessus |

## Vues à couvrir

13 écrans dans la spec (§7), environ 31 routes une fois séparées (détail dans la conversation et `FRONT_PLAN.md`). Il faut aussi prévoir des fenêtres modales : connexion visiteur, rédaction, liste des likes, plein écran, recadrage d'avatar et confirmations.

## En attente / à valider

- Les 5 points du §12 de `SPEC_TECH.md`, à valider par l'équipe (sessions ou JWT, format d'erreur, enveloppe WS, médias, TypeScript).
- La branche `dev` prévue par la spec n'existe pas encore : `frontend` merge vers `master` en attendant.
- Les rôles (Tech Lead, PO, PM) ne sont pas encore attribués aux membres.

## Prochaines étapes

1. **Maquettes Framer** (S1, `front/chore/mockups`) :
   - recevoir les inspirations de palettes et de composants d'aboumall ;
   - connecter Framer à Claude Code (plugin MCP Unframer) ;
   - tokens → composants de base → écrans clés (fil, post, profil, messages, paramètres, admin, fil mobile) ;
   - validation par aboumall avant de passer au code.
2. Setup du front (`front/chore/setup`) : Node 22, TypeScript, Tailwind, React Router, TanStack Query, MSW.
