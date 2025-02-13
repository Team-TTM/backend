const client = require('./db'); // Connexion à la base de données

const createAdherantTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
             id_adherant SERIAL PRIMARY KEY,
             numero_licence VARCHAR(255) UNIQUE NOT NULL,
             id_adresse VARCHAR(255) UNIQUE NOT NULL,
             id_contact VARCHAR(255) UNIQUE NOT NULL,
             prenom VARCHAR(255) NOT NULL,
             nom VARCHAR(255) NOT NULL,
             nom_usage VARCHAR(255),
             date_naissance DATE NOT NULL,
             sexe CHAR(1) CHECK (sexe IN ('M', 'F')) NOT NULL, 
             profession VARCHAR(255),
             FOREIGN KEY (numero_licence) REFERENCES licences(numero_licence) ON DELETE CASCADE,
             FOREIGN KEY (id_adresse) REFERENCES adherant_adresses(id) ON DELETE CASCADE,
             FOREIGN KEY (id_contact) REFERENCES adherant_contact(id) ON DELETE CASCADE                           
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
    createAdherantTable,
};