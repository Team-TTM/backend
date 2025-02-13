const client = require('./db'); // Connexion à la base de données

const createLicenceTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS licences (
            numero_licence SERIAL PRIMARY KEY,
            statut VARCHAR(255) NOT NULL,
            type VARCHAR(255) NOT NULL,
            longue BOOLEAN NOT NULL,
            demi_tarif BOOLEAN NOT NULL,
            hors_club BOOLEAN NOT NULL,
            categorie VARCHAR(255) NOT NULL,
            annee_blanche BOOLEAN NOT NULL
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "licence" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "licence":', err);
        throw err;
    }
};

module.exports = {
    createLicenceTable,
};