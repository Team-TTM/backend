const UsersModel = require("../models/usersModel");


/**
 * Trouver un utilisateur par son Google ID.
 * @async
 * @param {string} googleId - L'identifiant Google de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByGoogleId = async (googleId) => {
    return UsersModel.findUserByGoogleId(googleId);
};

/**
 * Trouver un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByFacebookId = async (facebookId) => {
    return UsersModel.findUserByFacebookId(facebookId);
};

/**
 * Trouver un utilisateur par son ID utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByUserId = async (userId) => {
    return UsersModel.findUserById(userId);
};

/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numeroLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<Object|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numeroLicence) => {
    return UsersModel.findUserByLicence(numeroLicence);
};

/**
 * Créer un utilisateur avec un Facebook ID.
 * @async
 * @param {string} facebookID - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<Object>} L'utilisateur créé.
 */
const createUserFacebook = async (facebookID) => {
    return UsersModel.createFacebookUser(facebookID);
};

/**
 * Créer un utilisateur avec un Google ID.
 * @async
 * @param {string} googleID - L'identifiant Google de l'utilisateur.
 * @returns {Promise<Object>} L'utilisateur créé.
 */
const createUserGoogle = async (googleID) => {
    return UsersModel.createGoogleUser(googleID);
};
/**
 * Mettre à jour l'ID adhérent d’un utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @param {string} adherantID - Le nouvel identifiant d'adhérent.
 * @returns {Promise<Object>} L'utilisateur mis à jour.
 */
const updateUserLicence = async (userId, adherantID) => {
    return UsersModel.updateAdherantId(userId, adherantID);
};



/**
 * Fusionner les comptes Facebook et Google d'un utilisateur.
 * @async
 * @param {number} userId1 - L'ID du premier utilisateur.
 * @param {number} userId2 - L'ID du second utilisateur.
 * @returns {Promise<Object>} L'utilisateur fusionné.
 * @throws {Error} Si un des utilisateurs est introuvable ou si la fusion est impossible.
 */
const mergeUserFacebookAndGoogleIds = async (userId1, userId2) => {
    try {
        const user1 = await UsersModel.findUserById(userId1);
        const user2 = await UsersModel.findUserById(userId2);

        if (!user1 || !user2) {
            throw new Error(`❌ Fusion impossible : L'un des utilisateurs (ID: ${userId1}, ID: ${userId2}) est introuvable.`);
        }

        const user1HasGoogle = !!user1.google_id;
        const user1HasFacebook = !!user1.facebook_id;
        const user2HasGoogle = !!user2.google_id;
        const user2HasFacebook = !!user2.facebook_id;

        if (user1HasGoogle && user2HasFacebook) {
            await UsersModel.deleteUserById(userId2);
            await UsersModel.updateFacebookId(userId1, user2.facebook_id);
            console.log(`✅ Fusion réussie : Google ID conservé, Facebook ID fusionné sous user ${userId1}`);
        }
        else if (user1HasFacebook && user2HasGoogle) {
            await UsersModel.deleteUserById(userId2);
            await UsersModel.updateGoogleId(userId1, user2.google_id);
            console.log(`✅ Fusion réussie : Facebook ID conservé, Google ID fusionné sous user ${userId1}`);
        }
        else {
            // 🔹 Cas où la fusion est impossible avec des raisons précises
            if (user1HasGoogle && user2HasGoogle) {
                throw new Error(`❌ Fusion impossible : Les deux comptes (ID: ${userId1}, ID: ${userId2}) sont déjà liés à Google.`);
            }
            if (user1HasFacebook && user2HasFacebook) {
                throw new Error(`❌ Fusion impossible : Les deux comptes (ID: ${userId1}, ID: ${userId2}) sont déjà liés à Facebook.`);
            }
            if (!user1HasGoogle && !user1HasFacebook && !user2HasGoogle && !user2HasFacebook) {
                throw new Error(`❌ Fusion impossible : Aucun des comptes (ID: ${userId1}, ID: ${userId2}) n'est lié à Google ou Facebook.`);
            }
            throw new Error(`❌ Fusion impossible : Les comptes (ID: ${userId1}, ID: ${userId2}) n'ont pas de services distincts (Google & Facebook).`);
        }

        // Retourner l'utilisateur mis à jour après la fusion
        return await UsersModel.findUserById(userId1);

    } catch (err) {
        console.error("❌ Erreur lors de la fusion des comptes :", err);
        throw err;
    }
};

// ✅ Exportation des fonctions
module.exports = {
    findUserByGoogleId,
    findUserByFacebookId,
    findUserByUserId,
    findUserByLicence,
    createUserFacebook,
    createUserGoogle,
    updateUserLicence,
    mergeUserFacebookAndGoogleIds,

};