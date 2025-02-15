const client = require('../config/database'); // Connexion à la base de données

/**
 * Crée la table "adherants" dans la base de données si elle n'existe pas.
 * @async
 * @returns {Promise<void>}
 */
const createAdherantTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS adherants
        (
            numero_licence    VARCHAR(255) PRIMARY KEY,
-- information
            prenom            VARCHAR(255)                       NOT NULL,
            nom               VARCHAR(255)                       NOT NULL,
            nom_usage         VARCHAR(255),
            date_naissance    DATE                               NOT NULL,
            sexe              CHAR(1) CHECK (sexe IN ('M', 'F')) NOT NULL,
            profession        VARCHAR(255),

-- adresse 
            principale        VARCHAR(255)                       NOT NULL,
            details           VARCHAR(255),
            lieu_dit          VARCHAR(255),
            code_postale      VARCHAR(20),
            ville             VARCHAR(255),
            pays              VARCHAR(255),
-- contact 
            mobile            VARCHAR(20),
            email             VARCHAR(255)                       NOT NULL,
            urgency_telephone VARCHAR(20),
-- licence 
            statut            BOOLEAN                            NOT NULL,
            type              VARCHAR(255)                       NOT NULL,
            longue            BOOLEAN                            NOT NULL,
            demi_tarif        BOOLEAN                            NOT NULL,
            hors_club         BOOLEAN                            NOT NULL,
            categorie         VARCHAR(255)                       NOT NULL,
            annee_blanche     BOOLEAN                            NOT NULL
        );


    `;
    try {
        await client.query(query);
        console.log('✅ Table "adherant" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "adherant":', err);
        throw err;
    }
};


const createAdherant = async (adherantData) => {
    const query = `
        INSERT INTO adherants (
            numero_licence, prenom, nom, nom_usage, date_naissance, sexe, profession,
            principale, details, lieu_dit, code_postale, ville, pays,
            mobile, email, urgency_telephone,
            statut, type, longue, demi_tarif, hors_club, categorie, annee_blanche
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, 
            $8, $9, $10, $11, $12, $13, 
            $14, $15, $16, 
            $17, $18, $19, $20, $21, $22, $23
        )
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [
            adherantData.licence.numero,
            adherantData.nom.prenom,
            adherantData.nom.nom,
            adherantData.nom.nomUsage,
            adherantData.dateNaissance,
            adherantData.sexe,
            adherantData.profession,
            adherantData.adresse.principale,
            adherantData.adresse.details,
            adherantData.adresse.lieuDit,
            adherantData.adresse.codePostal,
            adherantData.adresse.ville,
            adherantData.adresse.pays,
            adherantData.contacts.mobile,
            adherantData.contacts.email,
            adherantData.contacts.urgenceTelephone,
            adherantData.statut,
            adherantData.licence.type,
            adherantData.licence.longue,
            adherantData.licence.demiTarif,
            adherantData.licence.horsClub,
            adherantData.licence.categorieAge,
            adherantData.licence.anneeBlanche
        ]);
        console.log("✅ Nouvel adhérant inséré :", res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error("❌ Erreur lors de l'insertion de l'adhérant:", err);
        throw err;
    }
};

/**
 * Vérifie si un adhérent existe en base de données.
 * @param {string} num_licence - Le numéro de licence de l'adhérent.
 * @returns {Promise<boolean>} - Retourne `true` si l'adhérent existe, sinon `false`.
 */
const adherantExist = async (num_licence) => {
    const query = `
        SELECT 1
        FROM adherants
        WHERE numero_licence = $1
        LIMIT 1;
    `;

    try {
        const res = await client.query(query, [num_licence]);
        return res.rowCount > 0;
    } catch (err) {
        console.error("❌ Erreur lors de la vérification de l'adhérent:", err);
        throw err; //
    }
    ;
}
const findUserById = async (num_licence) => {
    const query = `
        SELECT *
        FROM users
        WHERE numero_licence = $1;
    `;
    try {
        const res = await client.query(query, [num_licence]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};


module.exports = {
    createAdherantTable,
    createAdherant,
    adherantExist,
    findUserById
};