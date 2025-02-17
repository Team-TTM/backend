const pool = require('../config/database'); // Connexion à la base de données

/**
 * Crée la table `users` si elle n'existe pas déjà.
 * @async
 * @throws {Error} En cas d'échec de la création de la table.
 */
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id_user INT AUTO_INCREMENT PRIMARY KEY,
            numero_licence VARCHAR(255) UNIQUE,
            role ENUM('user', 'dirigent') NOT NULL DEFAULT 'user',
            charte_signe BOOLEAN NOT NULL DEFAULT FALSE,
            google_id VARCHAR(255) UNIQUE,
            facebook_id VARCHAR(255) UNIQUE,
            newsletter BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (numero_licence) REFERENCES adherants(numero_licence) ON DELETE CASCADE
        );
    `;
    try {
        await pool.execute(query);
        // console.log('✅ Table "users" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "users":', err);
        throw err;
    }
};



/**
 * Insère un utilisateur avec un Facebook ID.
 * @async
 * @param {string} facebookId - L'ID Facebook de l'utilisateur.
 * @returns {Promise<Object>} L'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const createFacebookUser = async (facebookId) => {
    const query = `
        INSERT INTO users (facebook_id)
        VALUES (?)
        RETURNING *
    `;
    try {
        const [rows] = await pool.execute(query, [facebookId]);
        console.log('✅ Utilisateur Facebook inséré :', rows[0]);
        return rows[0];
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Facebook:', err);
        throw err;
    }
};


/**
 * Insère un utilisateur avec un Google ID.
 * @async
 * @param {string} googleId - L'ID Google de l'utilisateur.
 * @returns {Promise<Object>} L'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const createGoogleUser = async (googleId) => {
    const query = `
        INSERT INTO users (google_id)
        VALUES (?)
        RETURNING *
    `;
    try {
        const [rows] = await pool.execute(query, [googleId]);
        console.log('✅ Utilisateur Google inséré :', rows[0]);
        return rows[0];
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Google:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'ID Facebook de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserByFacebookId = async (facebookId) => {
    const query = `
        SELECT * FROM users
        WHERE facebook_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [facebookId]);
        return rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Facebook:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son Google ID.
 * @async
 * @param {string} googleId - L'ID Google de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserByGoogleId = async (googleId) => {
    const query = `
        SELECT * FROM users
        WHERE google_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [googleId]);
        return rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Google:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numberLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numberLicence) => {
    const query = `
        SELECT * FROM users
        WHERE numero_licence = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [numberLicence]);
        return rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};

/**
 * Recherche un utilisateur par son ID utilisateur.
 * @async
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de requête.
 */
const findUserById = async (userId) => {
    const query = `
        SELECT * FROM users
        WHERE id_user = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [userId]);
        return rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};

/**
 * Met à jour le Facebook ID d’un utilisateur.
 * @async
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {string} facebookId - Le nouvel ID Facebook.
 * @returns {Promise<Object|null>} L'utilisateur mis à jour ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateFacebookId = async (userId, facebookId) => {
    const query = `
        UPDATE users
        SET facebook_id = ?
        WHERE id_user = ?
    `;
    try {
        console.log("⌛️ Ajout de facebookId :", facebookId, "à l'utilisateur :", userId);

        // Utilisation de pool.query() au lieu de pool.execute()
        const [result] = await pool.query(query, [facebookId, userId]);


        // Vérifie si une ligne a été mise à jour et récupère l'utilisateur mis à jour
        if (result.affectedRows > 0) {
            // Récupère les infos mises à jour
            const [updatedUser] = await pool.query("SELECT * FROM users WHERE id_user = ?", [userId]);
            return updatedUser[0] || null;
        }
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Facebook ID:', err);
        throw err;
    }
};

/**
 * Met à jour le Google ID d’un utilisateur.
 * @async
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {string} googleId - Le nouvel ID Google.
 * @returns {Promise<User|null>} L'utilisateur mis à jour ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateGoogleId = async (userId, googleId) => {
    const query = `
        UPDATE users
        SET google_id = ?
        WHERE id_user = ?
        RETURNING *;
    `;
    try {
        console.log("⌛️ Ajout de googleId :", googleId, "à l'utilisateur :", userId);

        const [result] = await pool.query(query, [googleId, userId]);


        // Vérifie si une ligne a été mise à jour et récupère l'utilisateur mis à jour
        if (result.affectedRows > 0) {
            // Récupère les infos mises à jour
            const [updatedUser] = await pool.query("SELECT * FROM users WHERE id_user = ?", [userId]);
            return updatedUser[0] || null;
        }
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Google ID:', err);
        throw err;
    }
};

/**
 * Met à jour l’ID adhérant d’un utilisateur.
 * @async
 * @param {number} userId - L'ID de l'utilisateur.
 * @param {string} adherantId - Le nouvel ID adhérant (numéro de licence).
 * @returns {Promise<Object|null>} L'utilisateur mis à jour ou `null` si non trouvé.
 * @throws {Error} En cas d'erreur de mise à jour.
 */
const updateAdherentId = async (userId, adherantId) => {
    const query = `
        UPDATE users
        SET numero_licence = ?
        WHERE id_user = ?;
    `;
    try {
        console.log("⌛️ Ajout de la licence :", adherantId, "à l'utilisateur :", userId);

        // Utilisation de pool.query() au lieu de pool.execute()
        const [result] = await pool.query(query, [adherantId, userId]);


        // Vérifie si une ligne a été mise à jour et récupère l'utilisateur mis à jour
        if (result.affectedRows > 0) {
            // Récupère les infos mises à jour
            const [updatedUser] = await pool.query("SELECT * FROM users WHERE id_user = ?", [userId]);
            return updatedUser[0] || null;
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
        DELETE FROM users
        WHERE id_user = ?
    `;
    try {
        await pool.execute(query, [user.id_user]);
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de l’utilisateur:', err);
        throw err;
    }
};


module.exports = {
    createUserTable,
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
};