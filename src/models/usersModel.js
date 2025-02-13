const client = require('./db'); // Connexion à la base de données

const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id_user SERIAL PRIMARY KEY,
            id_adherant INTEGER UNIQUE ,
            role VARCHAR(255) CHECK IN ('user','dirigent') NOT NULL DEFAULT 'user',
            charte_signe BOOLEAN NOT NULL DEFAULT FALSE,
            google_id VARCHAR(255) UNIQUE DEFAULT null,
            facebook_id VARCHAR(255) UNIQUE,
            newsletter BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (id_adherant) REFERENCES adherant(id_adherant) ON DELETE CASCADE
            );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "users" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "users":', err);
        throw err;
    }
};

module.exports = {
    createUserTable,
};