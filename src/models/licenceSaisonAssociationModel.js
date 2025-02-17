const client = require('../config/database'); // Connexion à la base de données


const  createLicenceSaisonAssociationTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS licence_saison_association
        (
            saison        VARCHAR(9) NOT NULL, -- Référence à l'année dans la table \`anne_licence\`
            numero_licence VARCHAR(255) NOT NULL, -- Référence à \`numero_licence\` dans \`licences\`
            PRIMARY KEY (saison, numero_licence),
            FOREIGN KEY (saison) REFERENCES saison (saison_id) ON DELETE CASCADE,
            FOREIGN KEY (numero_licence) REFERENCES adherants (numero_licence) ON DELETE CASCADE
        );

    `;
    try {
        await client.query(query);
        console.log('✅ Table "licence_saison_association" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "licence_saison_association":', err);
        throw err;
    }
};

/**
 * Insère une nouvelle association entre une saison et une licence dans la table `licence_annee_association`.
 *
 * @param {string} idAnne - L'identifiant de l'année de la saison. Doit correspondre à une valeur dans la table `saison`.
 * @param {string} numeroLicence - Le numéro de licence. Doit correspondre à une valeur dans la table `adherants`.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque l'insertion est réussie.
 * @throws {Error} - Si une erreur survient lors de l'insertion des données.
 */
const insertLicenceSaisonAssociation = async (idAnne, numeroLicence) => {
    const query = `
        INSERT INTO licence_saison_association (saison, numero_licence)
        VALUES ($1, $2)
    `;
    const values = [idAnne, numeroLicence];

    try {
        await client.query(query, values);
        // console.log('✅ Données insérées dans la table "licence_annee_association".');
    } catch (err) {
        console.error('❌ Erreur lors de l\'insertion des données dans la table "licence_annee_association":', err);
        throw err;
    }
};

const saisonbyLicence = async (numeroLicence) => {
    const query = `
        SELECT saison
        FROM licence_saison_association
        WHERE numero_licence = $1;
    `;
    try {
        await client.query(query, numeroLicence);
        // console.log('✅ Données insérées dans la table "licence_annee_association".');
    } catch (err) {
        console.error('❌ Erreur lors de l\'insertion des données dans la table "licence_annee_association":', err);
        throw err;
    }
};


module.exports = {
    createLicenceSaisonAssociationTable,
    insertLicenceSaisonAssociation
};