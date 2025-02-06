const mongoose = require('mongoose');
const path = require("path");
const {importerXlsx} = require('../services/adherantService');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

// Chargement des variables d'environnement
const MONGO_DB_URL = process.env.MONGO_DB_URL;
const MONGO_DB_NAME = process.env.MONGO_DB_NAME;
const XLSX_FILE = 'export_adherents_27-11-2024.xlsx';

async function connectToDb() {
    try {
        // Connexion à la base de données
        await mongoose.connect(MONGO_DB_URL, {
            dbName: MONGO_DB_NAME,

        });
        console.log('✅ Connexion établie avec MongoDB');

        // Importation du fichier XLSX
        await importerXlsx(path.resolve(__dirname, '../../data', XLSX_FILE));
        } catch (err) {
        // Gestion des erreurs
        console.error('❌ Erreur lors de la connexion ou de l\'importation :', err.message);
        process.exit(1); // Quitte le processus avec une erreur
    }
}

module.exports = connectToDb;