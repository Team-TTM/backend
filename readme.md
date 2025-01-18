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