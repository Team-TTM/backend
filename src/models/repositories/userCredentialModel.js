const pool = require('../../config/database');
const UserCredential = require('../entities/UserCredential');// Connexion à la base de données


/**
 * Insère un utilisateur credential.
 * @async
 * @param {UserCredential} userCredential - L'utilisateur a inséré avec un ID Facebook.
 * @returns {Promise<number>} L'ID de l'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const create = async (userCredential) => {
    // console.log(userCredential);
    const query = `
        INSERT INTO users_credentials (user_id, mail, password)
        VALUES (?, ?, ?);

    `;
    try {
        await pool.execute(query, [userCredential.userId, userCredential.mail, userCredential.password]);
        // console.log('✅ Utilisateur Credential inséré :', userCredential.userId);
        return null;
    } catch (err) {
        // console.error('❌ Erreur lors de l’insertion de l’utilisateur Credential :', err);
        throw err;
    }
};


/**
 * Recherche un user credential par son mail.
 * @async
 * @param {String} mail - L'utilisateur a inséré avec un ID Facebook.
 * @returns {Promise<UserCredential|null>} L'ID de l'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const findByMail = async (mail) => {
    const query = `
        SELECT *
        FROM users_credentials
        where mail = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [mail]);
        if (rows[0]) {
            // console.log('✅ Utilisateur trouver :', rows[0].user_id);
            return UserCredential.fromDataBase(rows[0]);
        } else {
            // console.log('❌ Aucun Utilisateur trouvé avec mail :', mail);
            return null;
        }
    } catch (err) {
        // console.error('❌ Erreur lors de l’insertion de l’utilisateur Credential :', err);
        throw err;
    }
};
/**
 * Recherche un user credential par son mail.
 * @async
 * @param {Number} id - L'utilisateur a inséré avec un ID Facebook.
 * @returns {Promise<UserCredential|null>} L'ID de l'utilisateur inséré.
 * @throws {Error} En cas d'erreur lors de l'insertion.
 */
const findById = async (id) => {
    const query = `
        SELECT *
        FROM users_credentials
        where user_id = ?;
    `;
    try {
        const [rows] = await pool.execute(query, [id]);
        if (rows[0]) {
            // console.log('✅ Utilisateur trouver :', rows[0].user_id);
            return UserCredential.fromDataBase(rows[0]);
        } else {
            // console.log('❌ Aucun Utilisateur trouvé avec mail :', mail);
            return null;
        }
    } catch (err) {
        // console.error('❌ Erreur lors de l’insertion de l’utilisateur Credential :', err);
        throw err;
    }
};

module.exports = {
    findById,
    findByMail,
    create,
};