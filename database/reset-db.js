const mongoose = require('mongoose');
const User = require('../models/user');
const {resetUserBdAdherant} = require("../services/AdherantService");
const {resetBdUser} = require("../services/userService");  // Exemple avec un modèle User

async function resetDatabase() {
    try {
        console.log("Réinitialisation de la base de données...");

        // Connexion à la base de données (exemple MongoDB)
        await mongoose.connect('mongodb://localhost:27017/yourdb', { useNewUrlParser: true, useUnifiedTopology: true });

        await resetUserBdAdherant();
        console.log('✅ base de donné adherant suprimer ')
        await resetBdUser();
        console.log('✅ base de donné users suprimer ')

        // Ajoute ici d'autres collections à nettoyer si nécessaire

        console.log("Base de données réinitialisée avec succès !");
    } catch (error) {
        console.error("Erreur lors de la réinitialisation de la base de données :", error);
    } finally {
        mongoose.disconnect();  // Se déconnecter une fois terminé
    }
}

resetDatabase();