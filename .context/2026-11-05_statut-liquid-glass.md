# 2026-11-05 : Statut du « liquid glass » : un test, pas la DA définitive

## Décision d'aboumall

- Le style **liquid glass** (maquettes v1 à v8, `docs/mockups/liquid-glass/design-system.html`) est un **test**.
- aboumall est **satisfait de la v8**, mais ce style n'est peut-être **pas adapté à un réseau social**.
- **D'autres maquettes avec d'autres thèmes** seront faites plus tard, pour comparer.
- **Pas de maquettes de pages pour l'instant** (page d'un post, profil, messages, paramètres, admin, connexion…). On s'en tient aux composants.

## Ce qui reste valable quel que soit le thème

- La **table des 24 composants** (`DESIGN_SYSTEM.md` §5) : noms, rôles, variantes, états, props, lots, lien avec les IDs de la spec.
- Les **principes** qui ne dépendent pas du style : couleur réservée à ce qui a un sens, tokens (variables CSS) pour pouvoir changer de thème, contrastes WCAG AA, `prefers-reduced-motion`.
- Les décisions d'interface prises pendant les maquettes : posts façon Reddit (titre obligatoire, contenu optionnel, inscrit dans la spec v0.4), J'aime et Republier colorés, fil et plugins qui défilent séparément, mise en page 3 colonnes (nav · fil · recherche + rédaction + plugins).

## Ce qui pourra changer

- Les couleurs, les matières (verre, chrome), les polices, les rayons et les ombres.
- La page `design-system.html` sera alors régénérée avec le nouveau thème. Le script qui la génère reprend les styles d'une maquette de référence, donc il suffira de pointer vers la nouvelle.

## Conséquences pour la suite

- Le code des composants devra passer **uniquement par les tokens**, pour qu'un changement de thème ne touche pas les composants.
- Les prochaines maquettes de thèmes pourront réutiliser la même structure (accueil v8 + page des composants) pour comparer les styles à contenu égal.
