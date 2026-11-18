# 2026-11-05 : Maquette v3, rédaction à droite, fond noir, police épaisse

## Objectif

Appliquer les retours d'aboumall sur la v2. Les v1 et v2 sont conservées.

## Retours sur la v2 → changements dans la v3

| Retour | Changement |
|---|---|
| Mettre la rédaction dans la colonne de droite, sous la recherche | Colonne de droite : recherche → rédaction → plugins. La colonne centrale ne contient plus que le fil, sur toute la hauteur |
| Fond noir en thème sombre, sans les « points blancs » | Les « points blancs » venaient des rubans de lumière floutés en fond (`.backdrop`). Ils sont retirés en sombre, et le fond passe à `#000000`. Le thème clair garde ses reflets |
| Une police gratuite avec des caractères épais | **Unbounded** (titres, chiffres, initiales des avatars, logo) + **Manrope** (texte, en 500 par défaut, 700/800 pour le gras). Les deux sont gratuites (Google Fonts, licence OFL) |

## Choix des polices

- **Unbounded** : géométrique, large et épaisse, avec un côté futuriste qui va bien avec le chrome et le verre.
- **Manrope** : texte lisible aux petites tailles, avec des graisses épaisses (jusqu'à 800) pour les noms et les boutons.
- Alternatives gratuites si Unbounded est trop large : **Syne** (ExtraBold), **Archivo Black**, **Clash Display** (Fontshare), **Bricolage Grotesque**.

## Fichier

`docs/mockups/liquid-glass/v3.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair.

Vérifié avec des captures de Chrome headless à 1440 px (sombre et clair, accueil et planche de style), 1024 px et 400 px.

## Points d'attention

- Sur fond noir pur, le flou du verre n'a plus rien à déformer : c'est surtout le bord brillant et le reflet intérieur qui donnent l'effet verre. Si le rendu paraît trop plat, on pourra ajouter un fond très discret (dégradé gris presque noir, sans taches).
- Le bouton « Publier » de la nav fait doublon avec la tuile de rédaction sur l'accueil. On le garde pour publier depuis les autres pages (il ouvrira une fenêtre modale).

## En attente / à valider par aboumall

1. La rédaction dans la colonne de droite.
2. Le fond noir pur.
3. Unbounded + Manrope.

## Prochaines étapes

- Retours sur la v3, puis les autres écrans clés : page d'un post, profil, messages, paramètres, admin, connexion.
