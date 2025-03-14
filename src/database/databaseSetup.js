const { importerXlsx } = require('../services/adherantService');
const path = require('path');
const pool = require('../config/database');

/**
 * Fonction générique pour créer une table si elle n'existe pas.
 * @param {string} tableName - Nom de la table
 * @param {string} query - Requête SQL de création de la table
 */
const createTable = async (tableName, query) => {
    try {
        await pool.execute(query);
        console.log(`✅ Table '${tableName}' créée ou déjà existante.`);
    } catch (err) {
        console.error(`❌ Erreur lors de la création de la table '${tableName}':`, err);
        throw err;
    }
};

// Définition des requêtes SQL pour chaque table
const queries = {
    saison: `
        CREATE TABLE IF NOT EXISTS saison (
            saison_id VARCHAR(9) PRIMARY KEY
        );
    `,
    adherents: `
        CREATE TABLE IF NOT EXISTS adherents (
            numero_licence    VARCHAR(20) PRIMARY KEY,
            prenom            VARCHAR(255) NOT NULL,
            nom               VARCHAR(255) NOT NULL,
            nom_usage         VARCHAR(255),
            date_naissance    DATE NOT NULL,
            sexe              CHAR(1) NOT NULL,
            profession        VARCHAR(255),
            principale        VARCHAR(255) NOT NULL,
            details           VARCHAR(255),
            lieu_dit          VARCHAR(255),
            code_postale      VARCHAR(5),
            ville             VARCHAR(255),
            pays              VARCHAR(255),
            telephone         VARCHAR(10),
            mobile            VARCHAR(10),
            email             VARCHAR(255) NOT NULL,
            urgency_telephone VARCHAR(10),
            type              VARCHAR(255) NOT NULL,
            demi_tarif        BOOLEAN NOT NULL,
            hors_club         BOOLEAN NOT NULL,
            categorie         VARCHAR(255) NOT NULL,
            annee_blanche     BOOLEAN NOT NULL,
            pratique          VARCHAR(255) NOT NULL
        );
    `,
    users: `
        CREATE TABLE IF NOT EXISTS users (
            id_user        INT AUTO_INCREMENT PRIMARY KEY,
            numero_licence VARCHAR(20) UNIQUE,
            role           ENUM ('user', 'dirigent') NOT NULL DEFAULT 'user',
            charte_signe   BOOLEAN NOT NULL DEFAULT FALSE,
            google_id      VARCHAR(255) UNIQUE,
            facebook_id    VARCHAR(255) UNIQUE,
            newsletter     BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (numero_licence) REFERENCES adherents (numero_licence) ON DELETE CASCADE
        );
    `,
    licence_saison_association: `
        CREATE TABLE IF NOT EXISTS licence_saison_association (
            saison         VARCHAR(9) NOT NULL,
            numero_licence VARCHAR(255) NOT NULL,
            PRIMARY KEY (saison, numero_licence),
            FOREIGN KEY (saison) REFERENCES saison (saison_id) ON DELETE CASCADE,
            FOREIGN KEY (numero_licence) REFERENCES adherents (numero_licence) ON DELETE CASCADE
        );
    `
};

/**
 * Initialise la base de données en créant toutes les tables et en important les données XLSX.
 */
async function initDatabase() {
    try {
        // Création des tables
        for (const [tableName, query] of Object.entries(queries)) {
            await createTable(tableName, query);
        }

        // Importation du fichier XLSX
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2024));

    } catch (err) {
        console.error('❌ Erreur de connexion à MySQL:', err);
        process.exit(1);
    }
}

/**
 * Supprime toutes les tables de la base de données.
 */
async function dropAllTables() {
    try {
        const tableNames = Object.keys(queries).reverse();
        for (const tableName of tableNames) {
            const query = `DROP TABLE IF EXISTS \`${tableName}\``;
            await pool.query(query);
            console.log(`✅ Table '${tableName}' supprimée.`);
        }
        console.log('✅ Toutes les tables ont été supprimées.');
    } catch (err) {
        console.error('❌ Erreur lors de la suppression des tables:', err);
    }
}

module.exports = { initDatabase, dropAllTables };