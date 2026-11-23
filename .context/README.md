# .context

Rapports de travail sur le frontend : ce qui a été fait, les décisions prises, ce qui reste à faire.
Ils servent à reprendre le travail d'une session à l'autre et à montrer à l'équipe où on en est.

## État de la direction artistique

✅ **Direction retenue : « flat lines »** (2026-11-11). Référence : `docs/mockups/flat-lines/v11.html` et `docs/mockups/flat-lines/design-system.html`, documentée dans `docs/DESIGN_SYSTEM.md` (v0.5, 25 composants).
Le **« liquid glass »** (`docs/mockups/liquid-glass/`) était un test : il est gardé pour l'historique.

## Convention

- Un fichier par session ou par tâche : `AAAA-MM-JJ_<sujet>.md`.
- Chaque rapport suit la même structure :
  1. **Objectif**
  2. **Fait** (avec les fichiers et commits concernés)
  3. **Décisions** (et pourquoi)
  4. **En attente / à valider**
  5. **Prochaines étapes**
- Les rapports sont versionnés sur la branche `frontend`.

## Index

| Date | Rapport | Sujet |
|---|---|---|
| 2026-11-05 | [2026-11-05_specs-et-plan-front.md](2026-11-05_specs-et-plan-front.md) | Specs fonctionnelle et technique, plan du front, branches |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v1.md](2026-11-05_maquette-liquid-glass-v1.md) | Maquette v1 : DA liquid glass, accueil bento, nav gauche |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v2.md](2026-11-05_maquette-liquid-glass-v2.md) | Maquette v2 : monochrome, fil et plugins qui défilent séparément |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v3.md](2026-11-05_maquette-liquid-glass-v3.md) | Maquette v3 : rédaction à droite, fond noir, Unbounded + Manrope |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v4.md](2026-11-05_maquette-liquid-glass-v4.md) | Maquette v4 : posts façon Reddit (titre + contenu), survol, barre de défilement |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v5.md](2026-11-05_maquette-liquid-glass-v5.md) | Maquette v5 : barres de défilement discrètes ; spec v0.4 (titre des posts obligatoire) |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v6.md](2026-11-05_maquette-liquid-glass-v6.md) | Maquette v6 : barres de défilement natives masquées au repos, fond #111214 |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v7.md](2026-11-05_maquette-liquid-glass-v7.md) | Maquette v7 : J'aime en framboise pourpre, Republier en ambre |
| 2026-11-05 | [2026-11-05_maquette-liquid-glass-v8.md](2026-11-05_maquette-liquid-glass-v8.md) | Maquette v8 : J'aime et Republier sans brillance |
| 2026-11-05 | [2026-11-05_design-system-palette-composants.md](2026-11-05_design-system-palette-composants.md) | Design system : palette, contrastes, table des 24 composants |
| 2026-11-05 | [2026-11-05_maquette-design-system.md](2026-11-05_maquette-design-system.md) | Maquette du design system : palette des deux thèmes et 24 composants |
| 2026-11-05 | [2026-11-05_statut-liquid-glass.md](2026-11-05_statut-liquid-glass.md) | Le liquid glass est un test ; pas de maquettes de pages pour l'instant |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v1.md](2026-11-10_maquette-flat-lines-v1.md) | 2e DA « flat lines » : aplats et lignes grises, bento à droite ; maquettes rangées par DA dans `docs/mockups/<da>/` |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v2.md](2026-11-10_maquette-flat-lines-v2.md) | Flat lines v2 : fond sombre anthracite `#16181C` au lieu du noir pur |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v3.md](2026-11-10_maquette-flat-lines-v3.md) | Flat lines v3 : nav collée au bord gauche, fil et plugins centrés dans l'espace restant |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v4.md](2026-11-10_maquette-flat-lines-v4.md) | Flat lines v4 : fil sans lignes verticales |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v5.md](2026-11-10_maquette-flat-lines-v5.md) | Flat lines v5 : lignes horizontales du fil raccourcies (retrait de 20 px), survol arrondi |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v6.md](2026-11-10_maquette-flat-lines-v6.md) | Flat lines v6 : panneau des commentaires (réponses) à droite du fil, fils dépliables |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v7.md](2026-11-10_maquette-flat-lines-v7.md) | Flat lines v7 : commentaires insérés entre le fil et la colonne de droite, sur toute la largeur restante |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v8.md](2026-11-10_maquette-flat-lines-v8.md) | Flat lines v8 : commentaires limités à 520 px, fond « carte » plus contrasté pour les composants |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v9.md](2026-11-10_maquette-flat-lines-v9.md) | Flat lines v9 : marge de 24 px entre la nav et le fil quand les commentaires sont ouverts |
| 2026-11-10 | [2026-11-10_maquette-flat-lines-v10.md](2026-11-10_maquette-flat-lines-v10.md) | Flat lines v10 : liens en bleu (mentions, Voir plus, Voir N réponses), post long tronqué avec « Voir plus » |
| 2026-11-11 | [2026-11-11_design-system-flat-lines.md](2026-11-11_design-system-flat-lines.md) | Design system flat lines : palette des deux thèmes (contrastes corrigés), 24 composants + panneau des commentaires proposé |
| 2026-11-11 | [2026-11-11_flat-lines-v11-retenue.md](2026-11-11_flat-lines-v11-retenue.md) | Flat lines retenue : maquette v11 (contrastes corrigés), `DESIGN_SYSTEM.md` v0.3, composant 25 `CommentsPanel` au lot 2 |
| 2026-11-18 | [2026-11-18_decisions-liens-troncature-commentaires.md](2026-11-18_decisions-liens-troncature-commentaires.md) | Fusion dans `frontend` ; décisions : liens, `@username`, troncature par budget de hauteur, libellé « Commentaires » ; nettoyage des branches |
| 2026-11-18 | [2026-11-18_maquette-auth.md](2026-11-18_maquette-auth.md) | Maquette des écrans d'authentification : connexion (blocage après 5 échecs), inscription, vérification de l'email, mot de passe oublié, visiteur (bandeau + fenêtre) |
| 2026-11-23 | [2026-11-23_panneau-reglages-et-decisions-auth.md](2026-11-23_panneau-reglages-et-decisions-auth.md) | Panneau « Réglages » des maquettes (contraste, tokens, daltonisme) ; email à vérifier avant d'utiliser le site ; 2FA de côté ; troncature : post entier ≤ 45 % du fil, médias de hauteur fixe (format horizontal si tous sont horizontaux) ; nouveaux fonds `#0D0F11` / `#FFFFFF` |
| 2026-11-23 | [2026-11-23_maquettes-s3-s4.md](2026-11-23_maquettes-s3-s4.md) | Maquettes S3-S4 : `profile.html` (profils, onglets, listes, demandes), `settings.html` (profil, recadrage, compte, confidentialité, sécurité), `feed.html` (fil, rédaction, modification, suppression) ; socle `shell.css` / `shell.js` |
