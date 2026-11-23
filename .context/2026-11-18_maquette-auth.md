# 2026-11-18 : Maquette des écrans d'authentification (flat lines)

## Objectif

Premier des trois écrans clés à maquetter, avant le profil et la page d'un post : connexion, inscription, mot de passe oublié et accès visiteur. Ils sont faits un par un pour qu'aboumall teste chaque écran avant de passer au suivant.

## Fait

- Branche **`front/chore/mockups`**, recréée depuis `frontend`.
- **`docs/mockups/flat-lines/auth.html`** (nouveau), avec les tokens et les composants de la v11. L'ancre de l'URL choisit l'écran, et une barre « Maquette » en bas à gauche passe de l'un à l'autre :
  - `#login`, connexion (AUTH-02) :
    - email ou nom d'utilisateur, mot de passe affichable, lien « Mot de passe oublié ? », bouton « Continuer avec 42 » (AUTH-07) ;
    - erreur générique, prévenue 2 essais avant le blocage ;
    - **blocage après 5 échecs** avec un compte à rebours de 15 min, et un lien vers la réinitialisation ;
  - `#signup`, inscription (AUTH-01) :
    - « S'inscrire avec 42 », email, nom d'utilisateur préfixé `@` (3 à 20 caractères `[a-zA-Z0-9_]`, disponibilité en direct), mot de passe, confirmation, case CGU et politique de confidentialité ;
    - les règles du mot de passe reprennent les validateurs Django et se cochent pendant la saisie ;
    - le bouton reste inactif tant qu'un champ n'est pas valide ;
  - `#verify` et `#verified`, vérification de l'email (AUTH-04) : « Renvoyer l'email », avec 60 s d'attente entre deux envois, et « Modifier l'adresse » ;
  - `#forgot`, `#forgot-sent`, `#reset` et `#reset-expired`, mot de passe oublié (AUTH-05) :
    - le message d'envoi ne dit pas si le compte existe ;
    - le lien est valable 1 h ;
    - le nouveau mot de passe a les mêmes règles, et la connexion affiche ensuite « Mot de passe modifié » ;
  - `#guest`, fil Explorer en visiteur (VIS-01, 03, 04) :
    - nav réduite à Explorer et Recherche, bouton « S'abonner » sur chaque post ;
    - tuile « Nouveau ici ? » dans la colonne de droite ;
    - **bandeau permanent** « Connectez-vous pour participer » ;
    - au clic sur J'aime, Republier, Commenter ou S'abonner, une **fenêtre** s'ouvre avec un texte adapté à l'action. Elle se ferme avec Échap ou un clic dehors, et garde le focus.
- Deux éléments n'existent pas encore dans le design system : la **case à cocher** et l'**alerte en ligne** (erreur ou succès).
- Mise en page : carte de 420 px centrée. Sous 720 px, la carte perd son bord et prend toute la largeur. Le visiteur reprend la mise en page responsive de la v11.
- Vérifié :
  - captures Chrome headless, en sombre et en clair, à 1440, 1000 et 390 px ;
  - scénarios testés par script : champs vides, erreur, blocage, pseudo pris ou libre, règles, confirmation, CGU, redirection vers `#verify`, fenêtre visiteur et Échap.

## Décisions (proposées)

| Sujet | Proposition | Pourquoi |
|---|---|---|
| Mise en page | Une carte centrée, sans illustration ni colonne de marque | Cohérent avec le flat lines (aplats et lignes) ; simple à coder |
| Erreur de connexion | Un message générique, sans dire quel champ est faux | Ne révèle pas si un compte existe |
| OAuth 42 | Bouton en haut de l'inscription, en bas de la connexion | C'est un module bonus (Could) : facile à retirer s'il n'est pas fait |
| Visiteur | Bandeau en bas, plus la tuile « Nouveau ici ? » | VIS-04 demande un bandeau permanent, et la tuile remplace la rédaction |

## En attente / à valider par aboumall

1. Les écrans dans leur ensemble (tester avec la barre « Maquette »).
2. Ajouter la case à cocher et l'alerte en ligne comme composants du design system (26 et 27) ?
3. ~~Peut-on utiliser le site avant d'avoir vérifié son email ?~~ Non, tranché le 2026-11-23 ([rapport](2026-11-23_panneau-reglages-et-decisions-auth.md)).
4. ~~La 2FA (AUTH-06, Could) n'est pas maquettée.~~ Mise de côté le 2026-11-23 : on ne sait pas encore comment le backend la gérera.

## Prochaines étapes

- Retours sur l'authentification, puis maquette du **profil**, et enfin de la **page d'un post**.
