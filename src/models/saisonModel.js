const client = require('../config/database'); // Connexion à la base de données

/**
 * Crée la table "saison" si elle n'existe pas déjà.
 * @async
 * @function createSaisonTable
 * @returns {Promise<void>} Une promesse qui se résout lorsque la table est créée ou déjà existante.
 * @throws {Error} Si une erreur survient lors de la création de la table.
 */
const createSaisonTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS saison (
            saison_id VARCHAR (9) PRIMARY KEY 
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "saison" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "saison":', err);
        throw err;
    }
};

/**
 * Insère une saison dans la table "saison" si elle n'existe pas déjà.
 * @async
 * @function insertIfNotExists
 * @param {string} saison - La saison à insérer au format "YYYY/YYYY+1".
 * @returns {Promise<void>} Une promesse qui se résout lorsque la saison est insérée ou déjà existante.
 * @throws {Error} Si une erreur survient lors de l'insertion de la saison.
 */
const insertIfNotExists = async (saison) => {
    const query = `
        INSERT INTO saison (saison_id)
        VALUES ($1)
        ON CONFLICT (saison_id) DO NOTHING;
    `;
    try {
        await client.query(query, [saison]);
        // console.log(`✅ Saison "${saison}" insérée ou déjà existante.`);
    } catch (err) {
        console.error(`❌ Erreur lors de l'insertion de la saison "${saison}":`, err);
        throw err;
    }
};

module.exports = {
    createSaisonTable,
    insertIfNotExists
};