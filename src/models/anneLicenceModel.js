const client = require('./db'); // Connexion à la base de données

const createAnneLicenceTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS anne_licence (
            anne INTEGER PRIMARY KEY  -- Année de la licence
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "anne licence" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "anne licence":', err);
        throw err;
    }
};

module.exports = {
    createAnneLicenceTable,
};