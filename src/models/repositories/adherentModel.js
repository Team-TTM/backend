const pool = require('../../config/database'); // Connexion à la base de données


/**
 * Crée un nouvel adhérent dans la base de données via le modèle AdherentsModel.
 *
 * @param {Adherent} adherent - L'objet Adherent à insérer dans la base de données.
 * @returns {Promise} - Une promesse qui se résout lorsque l'adhérent est créé.
 */
const createAdherent = async (adherent) => {
    const query = `
        INSERT INTO adherents (licence_id, prenom, nom, nom_usage, date_naissance, sexe, profession,
                               principale, details, lieu_dit, code_postale, ville, pays,
                               telephone, mobile, email, urgency_telephone,
                            type, demi_tarif, hors_club, categorie, annee_blanche, pratique)
        VALUES (?, ?, ?,
                ?, ?, ?,
                ?,
                ?, ?, ?,
                ?, ?, ?,
                ?,
                ?, ?,
                ?, ?, ?,
                ?, ?, ?,
                ?)
        RETURNING *;

    `;
    try {
        const [rows] = await pool.execute(query, [
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

            adherent.type,
            adherent.demiTarif,
            adherent.horsClub,
            adherent.categorie,
            adherent.anneeBlanche,
            adherent.pratique,
        ]);
        console.log('⌛ creation Adherent : ', adherent.numeroLicence);
        return rows;
    } catch (err) {
        console.error('❌ Erreur lors de l\'insertion de l\'adhérant:', err, adherent);
        throw err;
    }
};

/**
 * Met à jour les informations d'un adhérent.
 * @async
 * @param {Adherent} adherent - L'objet Adherent contenant les informations à mettre à jour.
 * @returns {Promise<Boolean>} L'adhérent mis à jour.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateAdherent = async (adherent) => {
    if (!adherent || !adherent.numeroLicence) {
        throw new Error('L\'adhérent fourni est invalide.');
    }

    try {
        const [currentAdherent] = await pool.execute('SELECT * FROM adherents WHERE licence_id = ?', [adherent.numeroLicence]);

        if (currentAdherent.length === 0) {
            throw new Error('Aucun adhérent trouvé avec cette licence.');
        }

        const updates = [];
        const values = [];
        const fieldsToUpdate = [
            'prenom', 'nom', 'nom_usage', 'date_naissance', 'sexe', 'profession', 'principale', 'details',
            'lieu_dit', 'code_postale', 'ville', 'pays', 'telephone', 'mobile', 'email', 'urgency_telephone',
            'type', 'demi_tarif', 'hors_club', 'categorie', 'annee_blanche', 'pratique'
        ];

        fieldsToUpdate.forEach(field => {
            const newValue = adherent[field];
            const currentValue = currentAdherent[0][field];

            if (newValue !== currentValue) {
                updates.push(`${field} = ?`);
                values.push(newValue ?? null); // Remplacer par null si la nouvelle valeur est undefined
            }
        });

        // Si aucune valeur n'a été modifiée, ne pas effectuer de mise à jour
        if (updates.length === 0) {
            return false; // Aucune modification à effectuer
        }

        values.push(adherent.numeroLicence);

        const query = `
            UPDATE adherents
            SET ${updates.join(', ')}
            WHERE licence_id = ?
              AND (${updates.join(' OR ')})
        `;

        const [result] = await pool.execute(query, values);

        return result.affectedRows > 0;

    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour de l\'adhérent:', err);
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
        FROM adherents
        WHERE licence_id = ?
        LIMIT 1;
    `;

    try {
        const [rows] = await pool.execute(query, [num_licence]);
        return rows.length > 0;
    } catch (err) {
        console.error('❌ Erreur lors de la vérification de l\'adhérent:', err);
        throw err; //
    }
};


/**
 * Récupère toutes les informations d'un adhérent en fonction de son numéro de licence.
 *
 * @param {string} numeroLicence - Le numéro de licence de l'adhérent.
 * @returns {Promise<Array<Object>>} - Une promesse qui se résout en un tableau d'objets contenant les informations de l'adhérent.
 * @throws {Error} - Si une erreur survient lors de la requête.
 */
const getAdherentDetails = async (numeroLicence) => {
    const query = `
        SELECT adherents.*, GROUP_CONCAT(saison_adherents.saison_id) AS saisons
        FROM adherents
                 LEFT JOIN saison_adherents
                           ON adherents.licence_id = saison_adherents.licence_id
        WHERE adherents.licence_id = ?
        GROUP BY adherents.licence_id
    `;
    const values = [numeroLicence];
    try {
        const [rows] = await pool.execute(query, values);
        // console.log(rows);
        return rows[0];
    } catch (err) {
        console.error('Erreur lors de la récupération des informations de l\'adhérent:', err);
        throw err;
    }
};

/**
 * Récupère tous les adhérents de la base de données.
 *
 * @async
 * @returns {Promise<Array<Object>>} - Une promesse qui se résout avec un tableau contenant les informations des adhérents.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const getAllAdherents = async () => {
    const query = `
        SELECT adherents.*, GROUP_CONCAT(saison_adherents.saison_id) AS saisons
        FROM adherents
                 LEFT JOIN saison_adherents
                           ON adherents.licence_id = saison_adherents.licence_id
        GROUP BY adherents.licence_id
    `;
    try {
        const [rows] = await pool.execute(query);
        return rows;
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des adhérents:', err);
        throw err;
    }
};



module.exports = {
    createAdherent,
    adherentExist,
    getAdherentDetails,
    updateAdherent,
    getAllAdherents,
};