# 2026-11-23 : Maquettes des écrans S3 et S4 (profil, relations, paramètres, fil, posts)

## Objectif

aboumall valide le design system et veut finir toutes les maquettes qui manquent jusqu'au sprint S4 (« Je poste et je vois un fil ») avant de passer au code. Les écrans S2 (authentification) étaient déjà faits dans `auth.html`.

## Fait

Trois pages, plus un socle commun, dans `docs/mockups/flat-lines/` :

- **`shell.css` et `shell.js`** (nouveaux) : le socle des trois pages.
  - Contenu : tokens (fonds du 2026-11-23), composants, nav gauche, thème, vues par ancre, barre « Maquette », Toast, Modal (piège du focus, Échap, clic dehors), Dropdown (flèches du clavier).
  - Rendu des posts avec la règle des médias et la troncature au budget de 45 %.
  - Bouton d'abonnement, fenêtre de rédaction (création et modification).
  - Les icônes sont injectées par le script.
  - La v11, `auth.html` et `design-system.html` gardent leurs styles intégrés.
- **`profile.html`** : profil et relations (S3 : ACC-01, ACC-02, ACC-07, SOC-01 à 06, §3.1, §3.2).
  - `#me` : mon profil (privé), « Modifier le profil », lien vers les demandes en attente.
  - `#user` : un ami (abonnement mutuel), avec le statut en ligne et l'étiquette « Ami ».
  - `#user-public` : un compte public qui me suit, avec « Suivre en retour ». Ses J'aime sont privés : l'onglet l'explique.
  - `#private` : un compte privé que je ne suis pas. L'en-tête est visible, le contenu est masqué, et « S'abonner » devient « Demandé ».
  - `#private-ok` : un compte privé que je suis. Le contenu est visible, mais Republier est désactivé (REPOST-03).
  - Onglets Posts · Réponses · Médias · J'aime · Republications, avec des états vides et la note de visibilité (§3.2).
  - `#followers`, `#following`, `#friends` : mes listes. On peut retirer un abonné (SOC-05), avec une confirmation puis un toast « Annuler ».
  - `#requests` : les demandes reçues (Accepter / Refuser, avec « Annuler » dans le toast). `#requests-empty` montre l'état vide.
- **`settings.html`** : paramètres (S3 : ACC-03 à 06).
  - `#profile` :
    - photo de profil, nom affiché (compteur sur 50), bio (compteur sur 160) ;
    - « Enregistrer » reste inactif tant que rien ne change.
  - `#crop` : recadrage carré de l'avatar.
    - On glisse l'image, on zoome (molette ou curseur) ou on la déplace aux flèches, avec un aperçu rond.
    - Le recadrage est réellement fait dans un `canvas`.
    - La photo est gardée dans `localStorage` : elle s'affiche sur toutes les maquettes S3-S4.
  - `#avatar-error` : photo refusée (type, plus de 2 Mo).
  - `#account` : compte.
    - Email : on change d'adresse avec le mot de passe, puis on confirme par un lien.
    - Nom d'utilisateur : disponibilité vérifiée en direct, puis une confirmation qui prévient que les anciens liens ne marcheront plus.
  - `#privacy` : confidentialité.
    - Interrupteur « Compte privé ». Passer en public demande une confirmation, qui prévient que les demandes en attente seront acceptées.
    - Visibilité des J'aime et des republications : Tout le monde / Vos abonnés / Vous seulement.
  - `#security` : changement de mot de passe (ancien mot de passe, règles cochées en direct, confirmation).
  - « Mes données » et « Supprimer le compte » sont dans le menu, mais marqués S8.
- **`feed.html`** : fil et posts (S4 : FEED-01, FEED-02, POST-01, POST-06 à 08, MEDIA-01 à 05, NOTIF-03).
  - `#following` et `#explore` : défilement infini (squelettes, puis « Vous êtes à jour »). Le fil montre tous les formats de médias :
    - 1 horizontal en 16:9 ;
    - 4 horizontaux en 16:9 ;
    - un mélange de vertical et d'horizontal, en hauteur fixe ;
    - un vertical seul ;
    - une vidéo ;
    - un GIF.
  - Le fil montre aussi un post tronqué, « (modifié) » avec la date au survol, « Post supprimé » et « Post supprimé par la modération ».
  - `#empty` : fil Abonnements vide, avec des suggestions. `#loading` : premier chargement.
  - `#compose`, `#compose-media` : la fenêtre « Nouveau post » (POST-01, MEDIA-01 à 05).
    - Titre de 3 à 120 caractères. Contenu de 500 caractères maximum, avec un anneau de comptage et le nombre de caractères restants à partir de 450.
    - Jusqu'à 4 médias, ou une vidéo seule. Ils se choisissent avec le vrai sélecteur de fichiers, et leur type, leur poids et la durée des vidéos sont vérifiés.
    - Chaque média a un aperçu, un bouton pour le retirer et une barre d'envoi. « Publier » reste inactif pendant l'envoi.
    - Fermer avec un brouillon demande confirmation. Ctrl+Entrée publie.
  - `#edit` : modifier son post (POST-06). On peut changer le titre et le texte, et retirer des médias, mais pas en ajouter. « (modifié) » apparaît ensuite.
  - `#delete` : confirmation de suppression (POST-07). La trace « Post supprimé » reste dans le fil.
  - La colonne de droite garde la rédaction rapide de la v11. Son bouton Média ouvre la fenêtre complète, en reprenant le titre et le texte déjà saisis.
- **`v11.html`** : les liens Profil et Paramètres de la nav mènent aux nouvelles pages.
- **Vérifié** :
  - captures Chrome headless (1440 × 900, 1100 × 800, mobile 390 px, sombre et clair) ;
  - un script de 40 étapes sur les trois pages : publier, erreur « vidéo seule », envoi, menu, supprimer, modifier, abandonner un brouillon, s'abonner, J'aime masqués, demande à un compte privé, accepter une demande, retirer un abonné, nom pris ou libre, passer en public, recadrer ;
  - aucune erreur dans la console.

## Décisions (proposées, à valider)

| Sujet | Proposition | Pourquoi |
|---|---|---|
| En-tête du profil | Pas de bannière : avatar de 96 px, nom, badge « Privé », @, étiquette « Vous suit » ou « Ami », bio, date d'inscription, compteurs | Reste dans l'esprit flat lines ; la spec ne demande pas de bannière |
| Compteurs | Abonnements · abonnés · **amis**, et le nombre de posts dans l'en-tête collant | Rend visible le « friends system » des modules |
| Statut en ligne | Point vert sur l'avatar et « En ligne » sur le profil, **seulement pour un ami** | ACC-07 |
| Se désabonner | « Abonné » devient « Se désabonner » au survol, puis une confirmation. « Demandé » devient « Annuler » au survol, sans confirmation | Se désabonner d'un compte privé oblige à refaire une demande : ça mérite une confirmation |
| Retirer un abonné, refuser une demande | Sans notification, avec « Annuler » dans le toast | SOC-03 et SOC-05 |
| Changer d'email | Mot de passe actuel, puis lien de confirmation envoyé à la nouvelle adresse. L'ancienne reste active d'ici là | Sécurité ; à confirmer avec le backend |
| Passer en public | Une confirmation, qui annonce l'acceptation automatique des demandes en attente | §3.1 |
| Visibilité des J'aime et des republications | Trois choix uniques, enregistrés tout de suite avec un toast | §3.2 |
| Modifier un post | Pas d'ajout de média, seulement le retrait | POST-06 |
| Supprimer un post | Confirmation, sans « Annuler » : c'est définitif | §4.4.1 |
| Rédaction | Une fenêtre pour « Publier » (nav), et la rédaction rapide gardée dans la colonne de droite | Cohérent avec la v11 |

## En attente / à valider par aboumall

1. Les écrans dans leur ensemble : à tester avec la barre « Maquette » de chaque page, réduite par défaut sur mobile.
2. **Nouveaux composants** utilisés ici, absents du design system :
   - case à cocher et alerte en ligne (déjà en attente depuis l'authentification) ;
   - **choix unique** (`Radio`) dans Confidentialité ;
   - **étiquette** (« Vous suit », « Ami », « S8 ») : faut-il l'ajouter comme variante de `Badge` (07) ?

   Faut-il les ajouter comme composants 26 à 28 ?
3. ~~Troncature (options a/b/c, format 16:9).~~ Tranché le 2026-11-23, voir plus bas.
4. ~~Socle commun ou fichiers autonomes ?~~ On garde `shell.css` / `shell.js` (choix d'aboumall).

## Prochaines étapes

- Retours d'aboumall sur les trois pages.
- Toutes les maquettes jusqu'au S4 sont faites. Prochain jalon : `front/chore/setup`, puis `front/feat/design-tokens` et les composants du lot 1.
- Maquettes S5 et suivantes, au fil de l'eau : page d'un post, messages, notifications, recherche, administration, pages légales, 404.

## Suite du 2026-11-23 : retours d'aboumall

- **Socle commun** : validé, on garde `shell.css` et `shell.js` pour les prochaines maquettes.
- **Troncature** : la règle des 45 % et le minimum de 3 lignes sont validés. **Exception** : si tous les médias sont horizontaux, l'aperçu est beaucoup plus grand. Il prend toute la largeur du fil, au format du média s'il est seul, en 4:3 s'il y en a plusieurs. Le post peut alors aller jusqu'à **65 %** du fil, et le texte est coupé en conséquence.
  - `shell.js` (`M.clampAll`) : budget de 65 % pour ces posts. La hauteur de l'aperçu est plafonnée pour garder la place réelle du texte (3 lignes au plus) et ne descend jamais sous 200 px.
  - `DESIGN_SYSTEM.md` §4.7, `MediaGrid` (20) et §8 mis à jour, avec les mesures en 1440 × 1080 et 1440 × 900.
  - Le post « Train de nuit » de `feed.html` a maintenant un texte long, pour voir la coupe.
  - Une image 16:9 seule ne peut pas dépasser 325 px de haut : c'est sa taille sur toute la largeur du fil. L'agrandissement se voit surtout sur les photos en 3:2 et 4:3, et sur les grilles.
- **Bouton « ∞ Défilement infini »** dans la barre « Maquette » de `feed.html`. Il enlève la limite de 2 pages : une page de 3 posts (avec son numéro) arrive à chaque fois qu'on approche du bas du fil, et la page défile vers le bas toute seule. Un deuxième clic arrête le défilement, et « Vous êtes à jour » revient.
- Correctif : la bande « Exemples » de la fenêtre de rédaction a la même classe que la barre « Maquette ». Le bouton se plaçait donc dans la fenêtre : il cible maintenant `nav.mock-bar`.
- Vérifié sous Firefox headless (Chromium n'est plus dans le cache de Playwright) : hauteurs mesurées à 900 et 1080 px de haut, bouton testé sur une copie de la page où les délais s'exécutent tout de suite, aucune erreur JavaScript.
