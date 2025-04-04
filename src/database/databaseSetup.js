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
    adherents: `
        CREATE TABLE adherents (
            licence_id VARCHAR(20) PRIMARY KEY,
            prenom VARCHAR(255) NOT NULL,
            nom VARCHAR(255) NOT NULL,
            nom_usage VARCHAR(255),
            date_naissance DATE NOT NULL,
            sexe CHAR(1) NOT NULL,
            profession VARCHAR(255),
            principale VARCHAR(255) NOT NULL,
            details VARCHAR(255),
            lieu_dit VARCHAR(255),
            code_postale VARCHAR(5),
            ville VARCHAR(255),
            pays VARCHAR(255),
            telephone VARCHAR(10) NOT NULL,
            mobile VARCHAR(10),
            email VARCHAR(255) NOT NULL,
            urgency_telephone VARCHAR(10),
            type VARCHAR(255) NOT NULL,
            demi_tarif BOOLEAN NOT NULL,
            hors_club BOOLEAN NOT NULL,
            categorie VARCHAR(255) NOT NULL,
            annee_blanche BOOLEAN NOT NULL,
            pratique VARCHAR(255) NOT NULL
        );
    `,
    users: `
        CREATE TABLE users (
            user_id INT AUTO_INCREMENT PRIMARY KEY,
            licence_id VARCHAR(20) UNIQUE,
            role ENUM ('user', 'dirigeant','admin') NOT NULL DEFAULT 'user',
            charte_signe BOOLEAN NOT NULL DEFAULT false,
            google_id VARCHAR(255) UNIQUE,
            facebook_id VARCHAR(255) UNIQUE,
            newsletter BOOLEAN NOT NULL DEFAULT false
        );
    `,
    events: `
        CREATE TABLE events (
            event_id INT AUTO_INCREMENT PRIMARY KEY ,
            dirigeant_id INTEGER,
            name VARCHAR(255),
            description TEXT,
            created_at DATE,
            end_at     DATETIME,
            type       VARCHAR(255),
            nombre_max INT,
            lieu       VARCHAR(255)
        );
    `,
    saison: `
        CREATE TABLE saison (
            saison_id varchar(9) PRIMARY KEY
        );
    `,
    events_users: `
        CREATE TABLE events_users
        (
            event_id INT,
            user_id  INT,
            PRIMARY KEY (event_id, user_id)
        );

    `,
    saison_adherents: `
        CREATE TABLE saison_adherents (
            saison_id varchar(9),
            licence_id VARCHAR(20),
            PRIMARY KEY (saison_id, licence_id)
        );
    `,
    user_credentials: `
        CREATE TABLE users_credentials
        (
            user_id integer PRIMARY KEY,
            mail    varchar(255) UNIQUE,
            password varchar(255)
        );`,
    // ALTER TABLE commands
    addForeignKeys: [
        'ALTER TABLE users ADD FOREIGN KEY (licence_id) REFERENCES adherents  (licence_id) ON DELETE CASCADE;',
        'ALTER TABLE events ADD FOREIGN KEY (dirigeant_id) REFERENCES users (user_id)ON DELETE CASCADE;',
        'ALTER TABLE events_users ADD FOREIGN KEY (event_id) REFERENCES events (event_id)ON DELETE CASCADE;',
        'ALTER TABLE events_users ADD FOREIGN KEY (user_id) REFERENCES users (user_id)ON DELETE CASCADE;',
        'ALTER TABLE saison_adherents ADD FOREIGN KEY (saison_id) REFERENCES saison (saison_id)ON DELETE CASCADE;',
        'ALTER TABLE saison_adherents ADD FOREIGN KEY (licence_id) REFERENCES adherents (licence_id)ON DELETE CASCADE;',
        'ALTER TABLE users_credentials ADD FOREIGN KEY (user_id) REFERENCES users (user_id)ON DELETE CASCADE;'
    ]
};

/**
 * Initialise la base de données en créant toutes les tables et en important les données XLSX.
 */
async function initDatabase() {
    try {
        for (const [tableName, query] of Object.entries(queries)) {
            if (Array.isArray(query)) {
                // Si la valeur est un tableau (pour les ALTER TABLE)
                for (const alterQuery of query) {
                    await createTable(tableName, alterQuery);
                }
            } else {
                // Si la valeur est une requête SQL (pour les tables)
                await createTable(tableName, query);
            }
        }

        // Importation du fichier XLSX (si besoin)
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_DEV));

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
            if (!Array.isArray(tableName)) {
                const query = `DROP TABLE IF EXISTS \`${tableName}\``;
                await pool.query(query);
                console.log(`✅ Table '${tableName}' supprimée.`);
            }
        }
        console.log('✅ Toutes les tables ont été supprimées.');
    } catch (err) {
        console.error('❌ Erreur lors de la suppression des tables:', err);
    }
}

module.exports = { initDatabase, dropAllTables };