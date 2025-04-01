const pool = require('../../config/database'); // Connexion à la base de données


/**
 * Insère une saison dans la table 'saison' si elle n'existe pas déjà.
 * @async
 * @function insertIfNotExists
 * @param {string} saison - La saison à insérer au format 'YYYY/YYYY+1'.
 * @returns {Promise<void>} Une promesse qui se résout lorsque la saison est insérée ou déjà existante.
 * @throws {Error} Si une erreur survient lors de l'insertion de la saison.
 */
const insertIfNotExists = async (saison) => {
    const query = `
        INSERT IGNORE INTO saison (saison_id)
        VALUES (?);
    `;
    try {
        await pool.execute(query, [saison]);
        // console.log(`✅ Saison '${saison}' insérée ou déjà existante.`);
    } catch (err) {
        console.error(`❌ Erreur lors de l'insertion de la saison '${saison}':`, err);
        throw err;
    }
};

module.exports = {
    insertIfNotExists
};