# 🚀 Document de Cadrage & Répartition : Notre Mini Réseau Social / Forum (*ft_transcendence*)

> **Objectif de ce document :** Poser les bases claires de notre mini réseau social/forum, définir nos rôles officiels 42 et répartir précisément le travail en 4 grands chantiers pour atteindre nos 14 points obligatoires (avec une marge de sécurité)[cite: 5, 8, 11].

---

## 1. C'est quoi notre projet ? (Définition Globale)

Nous allons concevoir et développer un **mini réseau social / forum interactif** accessible depuis un navigateur web. 

Concrètement, l'application permettra aux utilisateurs de :
* S'inscrire, se connecter en toute sécurité et personnaliser leur profil (avatar, bio, etc.)[cite: 10, 15].
* Publier des messages, des posts ou des sujets de discussion sur un fil d'actualité ou un forum.
* Interagir entre utilisateurs : s'ajouter en amis, voir qui est en ligne, liker, commenter ou s'envoyer des messages en direct (chat)[cite: 13, 15].
* Naviguer de manière fluide sans recharger la page (grâce à une architecture SPA - Single Page Application).
* Le tout hébergé proprement dans des conteneurs Docker, avec une base de données PostgreSQL et des pages légales obligatoires (Politique de confidentialité et Conditions d'utilisation)[cite: 8, 9, 10].

---

## 2. L'Architecture Technique (Nos Services)

Pour faire tourner notre réseau social, notre structure Docker repose sur 3 briques simples :
1. **`database` (PostgreSQL) :** La base de données pour stocker les comptes, les messages du forum, les profils et les relations d'amitié[cite: 10].
2. **`backend` (Django + DRF) :** Le cerveau qui gère la logique du réseau (vérification des connexions, création des posts, gestion des routes API et des connexions en temps réel).
3. **`frontend` (React) :** L'interface visuelle sur laquelle les utilisateurs cliquent, écrivent leurs posts et discutent.

---

## 3. Les Rôles dans l'Équipe (Explication & Nuance)

Selon le sujet 42, **tout le monde dans l'équipe est développeur**[cite: 6]. Cependant, le sujet impose d'attribuer **3 rôles d'organisation** parmi nous (une personne cumule donc un rôle d'organisation + son rôle de dev)[cite: 5, 6] :

1. **Product Owner (PO) — *"Le Garant du Produit"***
   * **Responsabilité :** Il garde un œil sur le sujet pour s'assurer que notre réseau social respecte les exigences, les consignes et les fonctionnalités attendues[cite: 5, 6, 9].
2. **Project Manager (PM) / Scrum Master — *"Le Chef d'Orchestre"***
   * **Responsabilité :** Il s'assure que l'équipe communique bien, suit l'avancement des tâches (via Trello/GitHub) et aide à lever les blocages[cite: 6].
3. **Technical Lead / Architecte — *"L'Architecte Technique"***
   * **Responsabilité :** Il veille à la propreté de la structure globale (Docker, communication React ↔ Django ↔ Postgres) et conseille l'équipe sur les choix techniques[cite: 6].
4. **Développeurs (Tout le monde) :**
   * Chacun prend en charge sa partie du code, participe aux reviews, teste ses fonctionnalités et documente son travail[cite: 6].

---

## 4. Stratégie des Points & Marge de Sécurité

Le sujet exige de valider **14 points minimum** via la grille des modules[cite: 11]. Le sujet recommande fortement de **viser plus de 14 points** (par exemple 16 ou 17 points) au cas où un module serait refusé ou partiellement validé lors de la soutenance[cite: 11, 12].

Voici notre sélection ciblée pour le réseau social/forum :
* **Frameworks Frontend & Backend (Major) :** 2 points[cite: 13]
* **User Management / Profils & Amis (Major) :** 2 points[cite: 15]
* **Chat en direct / WebSockets (Major) :** 2 points[cite: 13]
* **Gestion des permissions / Rôles d'administration (Major) :** 2 points[cite: 15]
* **Système de notifications en temps réel (Minor) :** 1 point[cite: 13]
* **Système d'ORM pour la base de données (Minor) :** 1 point[cite: 13]
* **Design system sur mesure / Composants réutilisables (Minor) :** 1 point[cite: 13]
* **Recherche avancée avec filtres et pagination (Minor) :** 1 point[cite: 14]
* **Upload et gestion de fichiers / avatars (Minor) :** 1 point[cite: 14]
* **Double Authentification 2FA (Minor) :** 1 point[cite: 15]
* **Module de choix personnalisé / Fonctionnalité réseau avancée (Major/Minor) :** 1 à 2 points[cite: 20]

👉 **Total visé : 16 à 17 points** (ce qui nous laisse une vraie marge de sécurité de 2 à 3 points)[cite: 11].

---

## 5. Découpage du Travail en 4 Lots Clairs

Chaque membre de l'équipe prend en charge un lot de développement principal :

---

### 📦 LOT 1 : "Comptes, Sécurité & Gestion des Utilisateurs"
* **Périmètre :** Base de données, Backend & Authentification.
* **Ce que la personne va faire :**
  1. Inscription et connexion sécurisée dans Django (mots de passe hachés, sessions)[cite: 10].
  2. Gestion des **profils utilisateurs** (changement de pseudo, upload d'avatar, page de profil)[cite: 14, 15].
  3. Système d'amis (demandes, liste d'amis, statut en ligne/hors ligne)[cite: 13, 15].
  4. Module de **Double Authentification (2FA)**[cite: 15].

---

### 📦 LOT 2 : "Publications, Flux du Forum & Modération"
* **Périmètre :** Backend (API REST) & Logique métier.
* **Ce que la personne va faire :**
  1. Modèles de données et routes API pour les **posts**, catégories et commentaires du forum.
  2. Système de rôles et permissions (ex: modérateurs/admins qui peuvent supprimer des messages)[cite: 15].
  3. Recherche avancée dans les posts avec filtres et pagination[cite: 14].
  4. Validation stricte des contenus publiés côté backend[cite: 10].

---

### 📦 LOT 3 : "Messagerie Instantanée (WebSockets) & Notifications"
* **Périmètre :** Communication temps réel.
* **Ce que la personne va faire :**
  1. Connexion **WebSockets** (Django Channels) pour les échanges en direct[cite: 13].
  2. Chat privé entre utilisateurs et salons de discussion généraux[cite: 13].
  3. Système de **notifications en direct** (ex: alerte quand un ami envoie un message ou commente un post)[cite: 13].
  4. Gestion propre des connexions et déconnexions des clients[cite: 13].

---

### 📦 LOT 4 : "Interface Graphique (React SPA), Design System & Pages Légales"
* **Périmètre :** Frontend, Design & Expérience utilisateur.
* **Ce que la personne va faire :**
  1. Design global du réseau social (fil d'actualité, profils, chat) avec Tailwind ou un framework CSS[cite: 9, 10].
  2. Système de navigation en **Single Page Application (SPA)** sans rechargement de page.
  3. Création d'un mini **design system** avec au moins 10 composants UI réutilisables[cite: 13].
  4. Rédaction et intégration des pages obligatoires : **Politique de confidentialité** et **Conditions d'utilisation**[cite: 9].

---

## 6. Récapitulatif : Tableau d'Attribution

À valider ensemble lors de notre réunion d'équipe :

| Membre de l'équipe | Rôle Org. 42 | Lot de Travail Attribué | Focus Principal |
| :--- | :--- | :--- | :--- |
| **Membre A** | Tech Lead + Dev | **Lot 3** (WebSockets / Chat) | Messagerie temps réel, notifications |
| **Membre B** | Product Owner + Dev | **Lot 2** (Posts / API / Modération) | Logique du forum, permissions, API REST |
| **Membre C** | Scrum Master + Dev | **Lot 1** (Auth / Profils / 2FA) | BDD Postgres, système d'amis, sécurité |
| **Membre D** | Dev | **Lot 4** (UI/UX / SPA / Design System) | React, navigation fluide, pages légales |

---
<sub style="color: gray;">Généré avec Google Gemini</sub>