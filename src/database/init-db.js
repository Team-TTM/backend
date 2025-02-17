const {importerXlsx} = require('../services/adherantService');

const {createSaisonTable} = require("../models/saisonModel");
const {createAdherantTable} = require("../models/adherantModel");
const {createUserTable} = require("../models/usersModel");
const {createLicenceSaisonAssociationTable} = require("../models/licenceAnneAssociationModel");
const client = require("../config/database");

const path = require("path");




async function initDatabase() {
    try {
        // Connexion à la base de données
        await createAdherantTable()
        await createSaisonTable();
        await createUserTable();
        await createLicenceSaisonAssociationTable();

        // Importation du fichier XLSX
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2023));
        // await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2026));
        } catch (err) {
        // Gestion des erreurs
        console.error('❌Erreur de connexion à PostgreSQL', err);
        process.exit(1); // Quitte le processus avec une erreur
    }
}

async function dropAllTables() {
    try {
        // Obtenir la liste de toutes les tables de la base de données
        const res = await client.query(`
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        `);

        const tableNames = res.rows.map(row => row.table_name);
        console.log(tableNames)
        // Générer une requête pour supprimer toutes les tables
        for (const tableName of tableNames) {
            try {
                await client.query(`DROP TABLE IF EXISTS ${tableName} CASCADE;`);
                console.log(`✅ Table "${tableName}" supprimée.`);
            } catch (err) {
                console.error(`❌ Erreur lors de la suppression de la table "${tableName}":`, err);
            }
        }

        console.log('✅ Toutes les tables ont été supprimées.');
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des tables:', err);
    }
}

module.exports = {initDatabase,dropAllTables};
