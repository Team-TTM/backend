const client = require('../config/database'); // Connexion à la base de données


const   createLicenceAnneeAssociationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS licence_annee_association(
            id_anne        INTEGER NOT NULL, -- Référence à l'année dans la table \`anne_licence\`
            numero_licence  VARCHAR(255) NOT NULL, -- Référence à \`numero_licence\` dans \`licences\`
            PRIMARY KEY (id_anne, numero_licence),
            FOREIGN KEY (id_anne) REFERENCES anne_licence (anne) ON DELETE CASCADE,
            FOREIGN KEY (numero_licence) REFERENCES licences (numero_licence) ON DELETE CASCADE
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "licence_annee_association" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "licence_annee_association":', err);
        throw err;
    }
};

module.exports = {
    createLicenceAnneeAssociationTable,
};