# Projet Backend Node.js

## Description

Ce projet est une application backend construite avec Node.js et Express.  
Il intègre des fonctionnalités d'authentification via Google et Facebook en utilisant Passport.js, ainsi que des opérations sur la base de données.

## Prérequis

- Node.js (version v22.14.0 ou ultérieure)
- npm (version 10.9.2 ou ultérieure)
- Une base de données (MariaDB)

## Installation

1. Clonez le dépôt :

git clone https://github.com/votre-utilisateur/votre-repo.git
cd votre-repo

2. Installez les dépendances :

npm install

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du repertoire backend et en y ajoutant les informations nécessaires (ex: identifiants OAuth, informations de connexion à la base de données).
   Créez un fichier .env à la racine du répertoire backend avec les variables suivantes :
```
# Configuration du serveur
PORT=3000
NODE_ENV=development

# Configuration de la base de données
DB_HOST=localhost
DB_PORT=3306
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
DB_NAME=triathlon_db

# Clés d'API pour l'authentification
GOOGLE_CLIENT_ID=votre_client_id_google
GOOGLE_CLIENT_SECRET=votre_client_secret_google
FACEBOOK_APP_ID=votre_app_id_facebook
FACEBOOK_APP_SECRET=votre_app_secret_facebook

# JWT Secret pour l'authentification
JWT_SECRET=votre_secret_jwt

# URL du site
URL=http://localhost:3000
```

## Scripts npm

- **`start`** : Compile le frontend et démarre le serveur.
- **`dev`** : Démarre le serveur en mode développement avec `nodemon`.
- **`import:db`** : Exécute le script pour importer des données dans la base de données.
- **`build`** : Construit le frontend et met à jour le dossier `dist` du backend.
- **`clean`** : Supprime le dossier `dist` du backend.
- **`clean-bd`** : Réinitialise la base de données.
- **`lint`** : Analyse le code avec ESLint.

## Base de données
Le projet utilise MariaDB comme système de gestion de base de données. Les scripts de migration et de seeding sont disponibles dans le dossier scripts/.

Pour initialiser ou réinitialiser la base de données :
```ssh
npm run clean-bd
```
Pour importer des données de test :
```ssh
npm run import:db
```



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
   retourne 
401 Unauthorized si le token n'est pas fourni ou est invalide.

### **GET adherent**
- `GET users/adherent` : Récupère les informations de l'adhérent. Cette route nécessite un token d'identification dans l'en-tête de la requête.
Requête 
L'en-tête de la requête doit contenir un token d'authentification valide.

```http request
Authorization : Bearer <token>
```

Réponses
* **401 Unauthorized** si le token n'est pas fourni ou est invalide.
```json
{
  "message": "Authentification échouée"
}
```

* **200 OK** si l'adhérent est trouvé.
```json
{
   "numeroLicence": "numeroLicence",
   "statut": "statut",
   "type": "type",
   "demiTarif": true,
   "horsClub": false,
   "categorie": "categorie",
   "anneeBlanche": false,
   "pratique": "pratique",
   "prenom": "prenom",
   "nom": "nom",
   "nomUsage": "nomUsage",
   "dateNaissance": "YYYY-MM-DD",
   "sexe": "sexe",
   "profession": "profession",
   "principale": "adresse principale",
   "details": "détails supplémentaires",
   "lieuDit": "lieu-dit",
   "codePostal": "12345",
   "ville": "ville",
   "pays": "pays",
   "telephone": "0123456789",
   "mobile": "0612345678",
   "email": "email@example.com",
   "urgenceTelephone": "0787654321",
   "saison": "[saison]"
}
```

* **404 Not Found** : Si aucun adhérent correspondant n’est trouvé
```json
{
  "message": "Adhérent non trouvé"
}
```

* **500 Internal Server Error** : En cas d'erreur serveur
```json
{
  "message": "Erreur serveur"
}
```


## Déploiement
Le déploiement est automatisé via GitHub Actions. Lors d'un push sur la branche main, le workflow suivant est exécuté :


1. Installation des dépendances
2. Vérification du code avec ESLint
3. Déploiement des fichiers via FTPS vers le serveur de production


## Remarques
Assurez-vous que toutes les variables d'environnement sont correctement définies dans le fichier .env avant de lancer l'application.
Les tokens d'authentification générés ont une durée de validité limitée et doivent être renouvelés régulièrement.
Vérifiez que les permissions de la base de données sont correctement configurées pour l'utilisateur spécifié dans le fichier .env.
Après authentification, le token reçu doit être stocké côté client et inclus dans les requêtes pour accéder aux routes protégées.


## Remarques

- Assurez-vous que les scripts liés à la base de données sont bien configurés.
- Après authentification, le token reçu doit être stocké côté client et inclus dans les requêtes pour accéder aux routes protégées.