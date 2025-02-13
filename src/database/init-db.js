const { Client } = require('pg');
const path = require("path");
const {importerXlsx} = require('../services/adherantService');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const client = new Client({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_URL,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT
});

async function connectToDb(options) {
    try {
        // Connexion à la base de données
        await client.connect(options);
        console.log('✅ Connexion établie avec PostGre');

        // Importation du fichier XLSX
        // await importerXlsx(path.resolve(__dirname, '../../data', XLSX_FILE));
        } catch (err) {
        // Gestion des erreurs
        console.error('❌Erreur de connexion à la base de données PostgreSQL', err);
        process.exit(1); // Quitte le processus avec une erreur
    }
}

connectToDb();
// module.exports = connectToDb;