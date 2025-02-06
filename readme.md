# Projet Backend Node.js

## Description

Ce projet est une application backend construite avec Node.js et Express.  
Il intègre des fonctionnalités d'authentification via Google et Facebook en utilisant Passport.js, ainsi que des opérations sur la base de données.

## Prérequis

- Node.js (version 18.20.4 ou ultérieure)
- npm (version 10.7.0 ou ultérieure)
- Une base de données (MongoDB)

## Installation

1. Clonez le dépôt :

git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo

2. Installez les dépendances :

npm install

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant les informations nécessaires (ex: identifiants OAuth, informations de connexion à la base de données).

## Scripts npm

- **`start`** : Compile le frontend et démarre le serveur.
- **`dev`** : Démarre le serveur en mode développement avec `nodemon`.
- **`import:db`** : Exécute le script pour importer des données dans la base de données.
- **`build`** : Construit le frontend et met à jour le dossier `dist` du backend.
- **`clean`** : Supprime le dossier `dist` du backend.
- **`clean-bd`** : Réinitialise la base de données.
- **`lint`** : Analyse le code avec ESLint.

## Routes d'authentification

Le projet utilise Passport.js pour gérer l'authentification via Google et Facebook.

### **Google Authentication**
- `GET users/auth/google` : Redirige l'utilisateur vers la page de connexion Google.
- `GET users/auth/google/callback` : Callback après l'authentification Google, renvoie un token d'authentification.

### **Facebook Authentication**
- `GET users/auth/facebook` : Redirige l'utilisateur vers la page de connexion Facebook.
- `GET users/auth/facebook/callback` : Callback après l'authentification Facebook, renvoie un token d'authentification.

### **Licence Check**
- `POST /licence-check` : Vérifie la licence de l'utilisateur. Cette route nécessite un token d'identification dans l'en-tête de la requête.

## Remarques

- Assurez-vous que les scripts liés à la base de données sont bien configurés.
- Après authentification, le token reçu doit être stocké côté client et inclus dans les requêtes pour accéder aux routes protégées.