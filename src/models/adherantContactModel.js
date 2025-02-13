const client = require('./db'); // Connexion à la base de données

const createAdherantContactTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS adherant_contact (
            id SERIAL PRIMARY KEY,
            telephone VARCHAR(20),
            mobile VARCHAR(20),
            email VARCHAR(255) UNIQUE NOT NULL,
            urgency_telephone VARCHAR(20)
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "adherant contact" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "adherant contact":', err);
        throw err;
    }
};

module.exports = {
    createAdherantContactTable,
};