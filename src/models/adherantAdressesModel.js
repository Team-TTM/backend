const client = require('../config/database'); // Connexion à la base de données

const createAdherantAdresseTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS adherant_adresses (
             id SERIAL PRIMARY KEY,
             principale VARCHAR(255) NOT NULL,
             details VARCHAR(255),
             lieu_dit VARCHAR(255),
             code_postale VARCHAR(20),
             ville VARCHAR(255),
             pays VARCHAR(255)
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "adherant adresses" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "adherant adresses":', err);
        throw err;
    }
};

module.exports = {
    createAdherantAdresseTable,
};