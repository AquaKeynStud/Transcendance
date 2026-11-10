# 2026-11-10 : Maquette flat lines v2, fond sombre moins noir

## Objectif

Tester la flat lines avec un fond sombre moins noir, à la demande d'aboumall. La v1 est conservée pour comparer.

## Changement par rapport à la v1

Seule la palette du thème sombre change. La mise en page, les composants et le thème clair sont identiques.

| Token | v1 | v2 |
|---|---|---|
| Fond `--bg` | `#000000` | **`#16181C`** (anthracite neutre, sans teinte bleue) |
| Creux / recherche `--surface` | `#0A0A0B` | `#1D2025` |
| Ligne `--line` | `#2F3336` | `#33373D` |
| Ligne forte `--line-strong` | `#536471` | `#5B636D` |
| Texte secondaire `--text-2` / `--text-3` | `#8B9298` / `#71767B` | `#9AA0A6` / `#80868C` |
| Survol `--hover` | blanc 6 % | blanc 7 % |
| Texte sur bouton principal `--accent-ink` | `#0F1419` | `#16181C` |

**Pourquoi éclaircir aussi les lignes et les gris :**
- sur un fond plus clair, les lignes de la v1 perdaient du contraste ;
- les textes discrets passaient sous un contraste confortable.

## Fichier

`docs/mockups/flat-lines/v2.html` : `#ds` pour la planche de style, `?theme=light` pour le thème clair, `?scrolling` pour afficher les barres en permanence.

Vérifié avec des captures de Chromium headless (accueil sombre et planche de style) : aucune erreur dans la console.

## En attente / à valider par aboumall

1. La teinte : `#16181C`, encore plus clair (vers `#1E2024`), ou légèrement bleuté (vers `#15202B`) ?

## Prochaines étapes

- Retours, puis choix de la direction artistique avant de maquetter les autres écrans.
