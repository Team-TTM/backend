
const client = require('../config/database'); // Connexion à la base de données
const Adherent = require('./Adherent');
/**
 * Crée la table "adherants" dans la base de données si elle n'existe pas.
 * @async
 * @returns {Promise<void>}
 */
const createAdherentTable = async () => {
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
            telephone         VARCHAR(20),
            mobile            VARCHAR(20),
            email             VARCHAR(255)                       NOT NULL,
            urgency_telephone VARCHAR(20),
-- licence 
            statut            BOOLEAN                            NOT NULL,
            type              VARCHAR(255)                       NOT NULL,
            demi_tarif        BOOLEAN                            NOT NULL,
            hors_club         BOOLEAN                            NOT NULL,
            categorie         VARCHAR(255)                       NOT NULL,
            annee_blanche     BOOLEAN                            NOT NULL,
            pratique          VARCHAR(255)                       NOT NULL
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

/**
 * Crée un nouvel adhérent dans la base de données via le modèle AdherentsModel.
 *
 * @param {Adherent} adherent - L'objet Adherent à insérer dans la base de données.
 * @returns {Promise} - Une promesse qui se résout lorsque l'adhérent est créé.
 */
const createAdherent = async (adherent) => {
    const query = `
        INSERT INTO adherants (
            numero_licence, prenom, nom, nom_usage, date_naissance, sexe, profession,
            principale, details, lieu_dit, code_postale, ville, pays,
            telephone,mobile, email, urgency_telephone,
            statut, type, demi_tarif, hors_club, categorie, annee_blanche,pratique
        ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, 
            $8, $9, $10, $11, $12, $13, $14, 
            $15, $16, $17, $18, $19, $20, 
            $21, $22,$23,$24
        )
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [
            adherent.numeroLicence,
            adherent.prenom,
            adherent.nom,
            adherent.nomUsage,
            adherent.dateNaissance,
            adherent.sexe,
            adherent.profession,

            adherent.principale,
            adherent.details,
            adherent.lieuDit,
            adherent.codePostal,
            adherent.ville,
            adherent.pays,

            adherent.telephone,
            adherent.mobile,
            adherent.email,
            adherent.urgenceTelephone,

            adherent.statut,
            adherent.type,
            adherent.demiTarif,
            adherent.horsClub,
            adherent.categorie,
            adherent.anneeBlanche,
            adherent.pratique,

        ]);
        return res.rows[0];
    } catch (err) {
        console.error("❌ Erreur lors de l'insertion de l'adhérant:", err,adherent);
        throw err;
    }
};


const updateAdherent = async (adherent) => {
    const query = `
        UPDATE adherants SET
            prenom = $1,
            nom = $2,
            nom_usage = $3,
            date_naissance = $4,
            sexe = $5,
            profession = $6,
            principale = $7,
            details = $8,
            lieu_dit = $9,
            code_postale = $10,
            ville = $11,
            pays = $12,
            telephone = $13,
            mobile = $14,
            email = $15,
            urgency_telephone = $16,
            statut = $17,
            type = $18,
            demi_tarif = $19,
            hors_club = $20,
            categorie = $21,
            annee_blanche = $22,
            pratique = $23
        WHERE numero_licence = $24
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [
            adherent.prenom,
            adherent.nom,
            adherent.nomUsage,
            adherent.dateNaissance,
            adherent.sexe,
            adherent.profession,
            adherent.principale,
            adherent.details,
            adherent.lieuDit,
            adherent.codePostal,
            adherent.ville,
            adherent.pays,
            adherent.telephone,
            adherent.mobile,
            adherent.email,
            adherent.urgenceTelephone,
            adherent.statut,
            adherent.type,
            adherent.demiTarif,
            adherent.horsClub,
            adherent.categorie,
            adherent.anneeBlanche,
            adherent.pratique,
            adherent.numeroLicence
        ]);
        return res.rows[0];
    } catch (err) {
        console.error("❌ Erreur lors de la mise à jour de l'adhérant:", err, adherent);
        throw err;
    }
};
/**
 * Vérifie si un adhérent existe en base de données.
 * @param {string} num_licence - Le numéro de licence de l'adhérent.
 * @returns {Promise<boolean>} - Retourne `true` si l'adhérent existe, sinon `false`.
 */
const adherentExist = async (num_licence) => {
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

/**
 * Récupère toutes les informations d'un adhérent en fonction de son numéro de licence.
 *
 * @param {string} numeroLicence - Le numéro de licence de l'adhérent.
 * @returns {Promise<Array<Object>>} - Une promesse qui se résout en un tableau d'objets contenant les informations de l'adhérent.
 * @throws {Error} - Si une erreur survient lors de la requête.
 */
const getAdherentDetails = async (numeroLicence) => {
    const query = `
    SELECT adherants.*, array_agg(licence_saison_association.saison) AS saisons
    FROM adherants
    LEFT JOIN licence_saison_association
    ON adherants.numero_licence = licence_saison_association.numero_licence
    WHERE adherants.numero_licence = $1
    GROUP BY adherants.numero_licence
`;
    const values = [numeroLicence];

    try {
        const res = await client.query(query, values);
        // console.log('Informations de l\'adhérent:', res.rows);
        return res.rows[0];
    } catch (err) {
        console.error('Erreur lors de la récupération des informations de l\'adhérent:', err);
        throw err;
    }
};



module.exports = {
    createAdherentTable,
    createAdherent,
    adherentExist,
    getAdherentDetails,
    updateAdherent,
};