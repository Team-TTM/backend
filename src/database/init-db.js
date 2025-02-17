const {importerXlsx} = require('../services/adherantService');

const {createSaisonTable} = require("../models/saisonModel");
const {createAdherentTable} = require("../models/adherantModel");
const {createUserTable} = require("../models/usersModel");
const {createLicenceSaisonAssociationTable} = require("../models/licenceSaisonAssociationModel");
const client = require("../config/database");

const path = require("path");
const pool = require("../config/database");




async function initDatabase() {
    try {
        // Connexion à la base de données
        await createSaisonTable();
        await createAdherentTable()
        await createUserTable();
        await createLicenceSaisonAssociationTable();

        // Importation du fichier XLSX
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2023));
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2024));
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2026));
        } catch (err) {
        // Gestion des erreurs
        console.error('❌Erreur de connexion à MySQL', err);
        process.exit(1); // Quitte le processus avec une erreur
    }
}

async function dropAllTables() {
    try {
        const rows = ['users','licence_saison_association','saison','adherants',]
        // Créer une requête DROP TABLE pour chaque table
        for (const tableName of rows) {
            const query = `DROP TABLE IF EXISTS \`${tableName}\``;
            await pool.query(query);
            console.log(`Table ${tableName} supprimée.`);
        }

        console.log('Toutes les tables ont été supprimées.')
        console.log('✅ Toutes les tables ont été supprimées.');
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des tables:', err);
    }
}

module.exports = {initDatabase,dropAllTables};
