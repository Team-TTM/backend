const mongoose = require('mongoose');
const Users = require('../models/Users');
const Adherant = require("../models/Adherant");  // Exemple avec un modèle User

const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

// Chargement des variables d'environnement
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;

async function resetDatabase() {
    try {
        console.log("🚀Réinitialisation de la base de données...");

        await mongoose.connect(MONGO_DB_URL, {
            dbName: MONGO_DB_NAME,
        });

        await Adherant.collection.drop();
        console.log('✅ base de donné adherent supprimer ');
        await Users.collection.drop();
        console.log('✅ base de donné users supprimer ');

        // Ajoute ici d'autres collections à nettoyer si nécessaire

        console.log("✅ Base de données réinitialisée avec succès !");
    } catch (error) {
        console.error("❌Erreur lors de la réinitialisation de la base de données :", error);
    } finally {
        mongoose.disconnect();  // Se déconnecter une fois terminé
    }
}

resetDatabase();