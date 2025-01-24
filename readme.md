# Déploiement de l'Application

Voici les étapes pour lancer le serveur en local, en partant de la construction du frontend jusqu'à l'exécution du serveur backend.

## Étapes à suivre

1. **Construire le frontend**
   -   Aller dans le dossier `frontend` :
     ```bash
     cd frontend
     ```
   - construire le build du frontend qui sera dans le `fronted/dist` :
     ```bash
     npm run build
     ```

2. **Déplacer le frontend dans le backend**
   - Revenir à la racine du projet :
     ```bash
     cd ..
     ```
   - Copier le dossier `dist` généré dans le frontend vers le `backend` :
     ```bash
     cp -r frontend/dist backend/
     ```

3. **Lancer le serveur local**
   - Aller dans le dossier `backend` :
     ```bash
     cd backend
     ```
   - Démarre le serveur en local avec la commande :
     ```bash
     npm run start
     ```

## Résumé des commandes

# Documentation des Routes API

Base URL : /users


1. Authentification via Google

Méthode : POST
URL : /users/auth/google
Description : Cette route permet d’authentifier un utilisateur via Google.

Requête :
•	Body (JSON) :
```bash
  {
  "token": "string"
  }
```
	•	token : Le token d’identification généré par Google.

Réponse :

	•	Réponses :
	•	200 OK : { "message": "connected by google" }
	•	400 Bad Request : { "error": "Le token Google est requis pour l'authentification." }
	•	401 Unauthorized : { "error": "Le token Google est invalide ou expiré." }

2. Authentification via Facebook

Méthode : POST
URL : /users/auth/facebook
Description : Cette route permet d’authentifier un utilisateur via Facebook.

Requête :
•	Body (JSON) :
```bash
{
"token": "string"
}
```
	•	token : Le token d’identification généré par Facebook.

Réponse :

    •	Réponses :
    •	200 OK : { "message": "connected by facebook" }
    •	400 Bad Request : { "error": "Le token Facebook est requis pour l'authentification." }
    •	401 Unauthorized : { "error": "Le token Facebook est invalide ou expiré." }

3. Vérification de licence

Méthode : POST
URL : /users/licence-check
Description : Cette route vérifie si une licence est valide pour un utilisateur, en fonction du service utilisé (Google ou Facebook).


axios.get('/some-protected-route', {
headers: {
'Authorization': `Bearer ${token}`,  // Envoi du token dans l'en-tête Authorization
}
});
Requête :
•	Body (JSON) :
```bash
{
"token": "string",
"service": "string",
"licence": "string"
}
```
	•	token : Le token de l’utilisateur.
	•	service : Le service utilisé pour l’authentification. Valeurs possibles :
	•	"g" : Google.
	•	"f" : Facebook.
	•	licence : Le numéro de licence à vérifier.

Réponse :

    •   200 OK : { "message": "Licence checked for token and service." }
	•	400 Bad Request : { "error": "Token, service, et licence sont requis pour vérifier la licence." }
	•	404 Not Found : { "error": "Licence introuvable pour le service." }

