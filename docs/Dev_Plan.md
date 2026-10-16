# Plan de Projet & Organisation de l'Équipe — ft_transcendence (42)

> **Projet :** Mini Réseau Social / Forum en temps réel  
> **Stack Technique :** Django, Django Rest Framework (DRF), PostgreSQL, React, WebSockets, Docker  
> **Format :** Équipe de 4 personnes

---

## 1. Rôles et Responsabilités de l'Équipe

*Note : Conformément au sujet, chaque membre cumule un rôle d'organisation et un rôle de développeur.*

### 👤 Membre 1 — Tech Lead & Développeur Backend
* **Rôle d'organisation :** **Tech Lead / Architecte**
  * Définition de la structure de la base de données et des conventions de code.
  * Validation des Pull Requests (revue de code) sur Git.
* **Missions de développement :**
  * Configuration du projet Django & Django Rest Framework (DRF).
  * Modélisation de la base PostgreSQL (Modèles Utilisateurs, Posts, Commentaires, Relations).
  * Création des endpoints de l'API REST.

### 👤 Membre 2 — Product Owner & Développeur Frontend
* **Rôle d'organisation :** **Product Owner (PO)**
  * Vérification du respect des consignes du sujet et de la grille d'évaluation.
  * Suivi et calcul des points de modules (objectif : 14 points minimum).
* **Missions de développement :**
  * Initialisation de l'application React et intégration du CSS (ex: Tailwind CSS).
  * Développement des vues principales (Fil d'actualité, Profils, Formulaires).
  * Intégration des pages obligatoires (Politique de confidentialité & CGU).

### 👤 Membre 3 — Project Manager & Développeur Temps Réel
* **Rôle d'organisation :** **Scrum Master / Project Manager (PM)**
  * Organisation et suivi des tâches (sur Trello / GitHub Projects).
  * Animation des points d'étape et levée des blocages.
* **Missions de développement :**
  * Configuration des WebSockets (Django Channels / ASGI).
  * Implémentation de la messagerie instantanée (Chat) et des notifications temps réel.
  * Connexion WebSockets côté Frontend React.

### 👤 Membre 4 — Développeur Polyvalent & Responsable DevOps
* **Rôle d'organisation :** **Responsable DevOps & Qualité**
  * Gestion de la conteneurisation Docker et de la sécurité (HTTPS, `.env`).
  * Rédaction et mise en forme du `README.md` final (obligatoire pour l'évaluation).
* **Missions de développement :**
  * Implémentation du système d'amis (demandes, acceptations, statut en ligne).
  * Gestion de l'upload de fichiers (Avatars / Médias des posts) avec validation.
  * Support sur le Frontend ou le Backend selon l'avancement.

---

## 2. Plan d'Attaque Étape par Étape

```
[Semaine 1 : Socle & Setup] ──> [Semaine 2 : Core Features] ──> [Semaine 3 : Temps Réel] ──> [Semaine 4 : Polissage & Finalisation]
```

### Étape 1 : Initialisation & Infrastructure (Tous)
* [ ] Création du dépôt Git et règles de nommage des branches.
* [ ] Configuration de Docker Compose (`Django` + `PostgreSQL` + `React`).
* [ ] Mise en place de l'authentification de base (Login / Register / Hachage des mots de passe).
* [ ] Validation que le projet se lance avec une seule commande.

### Étape 2 : Développement du Cœur du Forum / Réseau Social
* [ ] **Backend :** Modèles et endpoints API pour les utilisateurs, profils, posts et commentaires.
* [ ] **Frontend :** Navigation, formulaires de connexion, fil d'actualité, profil utilisateur.
* [ ] **DevOps :** Gestion sécurisée des variables d'environnement (`.env` & `.env.example`).

### Étape 3 : Fonctionnalités Temps Réel & Interactions
* [ ] **WebSockets :** Mise en place du chat privé ou canal global entre utilisateurs.
* [ ] **Système d'Amis :** Ajouter/bloquer des amis, affichage du statut (en ligne / hors-ligne).
* [ ] **Upload de Fichiers :** Gestion des avatars et images dans les publications.

### Étape 4 : Modules, Sécurité & Documentation
* [ ] Validation de la conformité HTTPS.
* [ ] Rédaction des mentions légales (Privacy Policy & Terms of Service).
* [ ] Rédaction complète du `README.md` (Présentation, Rôles, Schéma DB, Répartition).
* [ ] Recette finale et tests de la soutenance (changement de code rapide sur demande de l'évaluateur).

---

## 3. Décompte des Modules (Objectif 14 Points)

| Catégorie | Module | Type | Points | Responsable |
| :--- | :--- | :--- | :---: | :--- |
| **Web** | Framework Frontend (React) + Backend (Django) | Major | 2 pts | Membre 1 & 2 |
| **Web** | WebSockets (Temps réel) | Major | 2 pts | Membre 3 |
| **Web** | Interaction Utilisateur (Chat + Profil + Amis) | Major | 2 pts | Membre 2, 3 & 4 |
| **User Management** | Gestion Standard des Utilisateurs (Avatars, Profils, Statut) | Major | 2 pts | Membre 1 & 4 |
| **Web** | Utilisation d'un ORM (Django ORM) | Minor | 1 pt | Membre 1 |
| **Web** | Système de Notifications complet | Minor | 1 pt | Membre 3 |
| **Web** | Upload et Gestion de Fichiers (Avatars, Médias) | Minor | 1 pt | Membre 4 |
| **Web** | Recherche Avancée (Filtres, Tri sur les posts) | Minor | 1 pt | Membre 2 |
| **User Management** | Authentification OAuth 2.0 (42 ou Google) | Minor | 1 pt | Membre 1 |
| **Accessibility** | Internationalisation (i18n - 3 langues) *(Bonus Sécurité)* | Minor | 1 pt | Membre 2 |
| **TOTAL ESTIMÉ** | | | **14 pts** | |
