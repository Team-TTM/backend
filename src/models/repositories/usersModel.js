const pool = require('../../config/database');
const User = require('../entities/User');// Connexion à la base de données


/**
 * Insère un utilisateur avec un Facebook ID.
 * @async
 * @param {User} user - L'utilisateur a inséré avec un ID Facebook.
 * @returns {Promise<number>} L'ID de l'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const createFacebookUser = async (user) => {
    const query = `
        INSERT INTO users (facebook_id)
            VALUES (?)
                RETURNING *
    `;
    try {
        const [rows] = await pool.execute(query, [user.facebook_id]);
        console.log('✅ Utilisateur Facebook inséré :', rows[0].user_id);
        return rows[0].user_id;
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Facebook:', err);
        throw err;
    }
};


/**
 * Insère un utilisateur avec un Google ID.
 * @async
 * @param {User} user - L'utilisateur à insérer avec un ID Google.
 * @returns {Promise<number>} L'ID de l'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const createGoogleUser = async (user) => {
    const query = `
        INSERT INTO users (google_id)
            VALUES (?)
                RETURNING *
    `;
    try {
        const [rows] = await pool.execute(query, [user.google_id]);
        console.log('✅ Utilisateur Google inséré :', rows[0].user_id);
        return rows[0].user_id;
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Google:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'ID Facebook de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserByFacebookId = async (facebookId) => {
    const query = `
        SELECT *
        FROM users
        WHERE facebook_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [facebookId]);
        if (rows[0]) {
            console.log(`🔍 Utilisateur trouvé avec Facebook ID ${facebookId}:`, rows[0].user_id);
            return User.createUserFromDataBase(rows[0]);
        } else {
            console.log(`🔍 Utilisateur non trouvé avec Facebook ID ${facebookId}`);
            return null;
        }
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Facebook:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son Google ID.
 * @async
 * @param {string} googleId - L'ID Google de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserByGoogleId = async (googleId) => {
    const query = `
        SELECT *
        FROM users
        WHERE google_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [googleId]);
        if (rows[0]) {
            console.log(`🔍 Utilisateur trouvé avec Google ID ${googleId}:`, rows[0].user_id);
            return User.createUserFromDataBase(rows[0]);
        } else {
            console.log(`🔍 Utilisateur non trouvé avec Google ID ${googleId}`);
            return null;
        }
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Google:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numberLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numberLicence) => {
    const query = `
        SELECT *
        FROM users
        WHERE licence_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [numberLicence]);
        if (rows[0]) {
            console.log(`🔍 Utilisateur trouvé avec le numéro de licence ${numberLicence}:`, rows[0]);
            return User.createUserFromDataBase(rows[0]);
        } else {
            console.log(`🔍 Utilisateur non trouvé avec le numéro de licence ${numberLicence}`);
            return null;
        }

    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son ID utilisateur.
 * @async
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserById = async (userId) => {
    const query = `
        SELECT *
        FROM users
        WHERE user_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [userId]);
        if (rows[0]) {
            console.log(`🔍 Utilisateur trouvé avec l'user ID ${userId}:`, rows[0]);
            return User.createUserFromDataBase(rows[0]);
        } else {
            console.log(`🔍 Utilisateur non trouvé avec l'user ID ${userId}`);
            return null;
        }
    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};

/**
 /**
 * Met à jour le Facebook ID d’un utilisateur.
 * @async
 * @param {User} user - L'utilisateur à mettre à jour.
 * @returns {Promise<void>} Une promesse qui se résout lorsque l'utilisateur est mis à jour.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateFacebookId = async (user) => {
    const query = `
        UPDATE users
        SET facebook_id = ?
        WHERE user_id = ?
    `;
    try {
        console.log(`⌛️ Ajout de Facebook ID: ${user.facebook_id} à l'utilisateur ID: ${user.id_user}`);
        const [result] = await pool.query(query, [user.facebook_id, user.id_user]);
        if (result.affectedRows > 0) {
            console.log(`✅ Facebook ID mis à jour pour l'utilisateur ID: ${user.id_user}`);
        }
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Facebook ID:', err);
        throw err;
    }
};

/**
 * Met à jour le Google ID d’un utilisateur.
 * @async
 * @param {User} user - L'utilisateur à mettre à jour.
 * @returns {Promise<void>} L'utilisateur mis à jour ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateGoogleId = async (user) => {
    const query = `
        UPDATE users
        SET google_id = ?
        WHERE user_id = ?;
    `;
    try {
        console.log('⌛️ Ajout de googleId :', user.google_id, 'à l\'utilisateur :', user.id_user);
        const [result] = await pool.query(query, [user.google_id, user.id_user]);
        if (result.affectedRows > 0) {
            console.log(`✅Google ID mis à jour pour l'utilisateur ID: ${user.id_user}`);
        }
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Google ID:', err);
        throw err;
    }
};

/**
 * Met à jour l’ID adhérant d’un utilisateur.
 * @async
 * @param {User} user - L'utilisateur à mettre à jour.
 * @returns {Promise<void>} L'utilisateur mis à jour ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateAdherentId = async (user) => {
    const query = `
        UPDATE users
        SET licence_id = ?
        WHERE user_id = ?;
    `;
    try {
        console.log('⌛️ Ajout de la licence :', user.licence_id, 'à l\'utilisateur :', user.id_user);
        const [result] = await pool.query(query, [user.licence_id, user.id_user]);
        if (result.affectedRows > 0) {
            console.log(`✅ Numéro de licence mis à jour pour l'utilisateur ID: ${user.id_user}`);
        }
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour de l’ID adhérant:', err);
        throw err;
    }
};

/**
 * Supprime un utilisateur par son ID.
 * @async
 * @param {Object} user - L'objet utilisateur contenant `id_user` à supprimer.
 * @returns {Promise<void>} Une promesse qui se résout lorsque l'utilisateur est supprimé.
 * @throws {Error} En cas d'erreur de suppression.
 */
const deleteUserById = async (user) => {
    const query = `
        DELETE
        FROM users
        WHERE user_id = ?
    `;
    try {
        console.log(`⌛️ Suppression de l'utilisateur avec ID: ${user.id_user}`);
        await pool.execute(query, [user.id_user]);
        console.log(`✅ Utilisateur avec ID: ${user.id_user} supprimé`);
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de l’utilisateur:', err);
        throw err;
    }
};

/**
 * Supprime l'ID Facebook d'un utilisateur.
 * @async
 * @param {Object} user - L'objet utilisateur contenant `id_user` à mettre à jour.
 * @returns {Promise<void>} Une promesse qui se résout lorsque l'ID Facebook est supprimé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const deleteFacebookId = async (user) => {
    const query = `
        UPDATE users
        SET facebook_id = NULL
        WHERE user_id = ?;
    `;
    try {
        console.log(`⌛️ Suppression de l'ID Facebook de l'utilisateur avec ID: ${user.id_user}`);
        await pool.execute(query, [user.id_user]);
        console.log(`✅ ID Facebook supprimé pour l'utilisateur avec ID: ${user.id_user}`);
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de l\'ID Facebook de l\'utilisateur:', err);
        throw err;
    }
};

/**
 * Supprime l'ID Google d'un utilisateur.
 * @async
 * @param {Object} user - L'objet utilisateur contenant `id_user` à mettre à jour.
 * @returns {Promise<void>} Une promesse qui se résout lorsque l'ID Google est supprimé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const deleteGoogleId = async (user) => {
    const query = `
        UPDATE users
        SET google_id = NULL
        WHERE user_id = ?;
    `;
    try {
        console.log(`⌛️ Suppression de l'ID Google de l'utilisateur avec ID: ${user.id_user}`);
        await pool.execute(query, [user.id_user]);
        console.log(`✅ ID Google supprimé pour l'utilisateur avec ID: ${user.id_user}`);
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de l’ID Google de l’utilisateur:', err);
        throw err;
    }
};



module.exports = {
    createFacebookUser,
    createGoogleUser,
    findUserByFacebookId,
    findUserByGoogleId,
    findUserByLicence,
    findUserById,
    updateFacebookId,
    updateGoogleId,
    updateAdherentId,
    deleteUserById,
    deleteFacebookId,
    deleteGoogleId,
};