const pool = require('../../config/database'); // Connexion à la base de données




/**
 * Insère une nouvelle association entre une saison et une licence dans la table `licence_annee_association`.
 *
 * @param {string} idAnne - L'identifiant de l'année de la saison. Doit correspondre à une valeur dans la table `saison`.
 * @param {string} numeroLicence - Le numéro de licence. Doit correspondre à une valeur dans la table `adherants`.
 * @returns {Promise<Boolean>} - Une promesse qui se résout lorsque l'insertion est réussie.
 * @throws {Error} - Si une erreur survient lors de l'insertion des données.
 */
const insertLicenceSaisonAssociation = async (idAnne, numeroLicence) => {
    const query = `
        INSERT INTO saison_adherents (saison_id, licence_id)
        VALUES (?, ?)
    `;
    const values = [idAnne, numeroLicence];

    try {
        console.log('⌛️ Requête association saison :', idAnne, 'Licence :', numeroLicence);
        await pool.execute(query, values);
        return true;
        console.log('✅ Données insérées dans la table \'licence_annee_association\'.');
    } catch (err) {
        console.error('❌ Erreur lors de l\'insertion des données dans la table \'licence_annee_association\':', err);
        throw err;
    }
};

/**
 * Insère une nouvelle association entre une saison et une licence dans la table `licence_annee_association`.
 *
 * @param {string} numeroLicence - Le numéro de licence. Doit correspondre à une valeur dans la table `adherants`.
 * @returns {Promise<[String]>} - Une promesse qui se résout toutes les saison de l'adherent.
 * @throws {Error} - Si une erreur survient lors de l'insertion des données.
 */
const saisonbyLicence = async (numeroLicence) => {
    const query = `
        SELECT saison_id
        FROM saison_adherents
        WHERE licence_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [numeroLicence]);
        return rows;
        // console.log('✅ Données insérées dans la table 'licence_annee_association'.');
    } catch (err) {
        console.error('❌ Erreur lors de l\'insertion des données dans la table \'licence_annee_association\':', err);
        throw err;
    }
};


module.exports = {
    insertLicenceSaisonAssociation,
    saisonbyLicence,
};