const UsersModel = require("../models/usersModel");
const User = require("../models/User");


/**
 * Trouver un utilisateur par son Google ID.
 * @async
 * @param {string} googleId - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByGoogleId = async (googleId) => {
    const user = await UsersModel.findUserByGoogleId(googleId);
    if (!user) {
        return null;
    }
    // Retourner un objet de type User
    return new User(...user);
};

/**
 * Trouver un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByFacebookId = async (facebookId) => {
    const user =  await UsersModel.findUserByFacebookId(facebookId);
    if (!user) {
        return null;
    }
    // Retourner un objet de type User
    return new User(...user);

};

/**
 * Trouver un utilisateur par son ID utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByUserId = async (userId) => {
    const user = await UsersModel.findUserById(userId);
    if (!user) {
        return null;
    }
    // Retourner un objet de type User
    return new User(...user);
};

/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numberLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numberLicence) => {
    const user = await  UsersModel.findUserByLicence(numberLicence);
    if (!user) {
        return null;
    }
    return new User(...user);
};

/**
 * Créer un utilisateur avec un Facebook ID.
 * @async
 * @param {string} facebookID - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserFacebook = async (facebookID) => {
    // Appel à la méthode du modèle pour insérer l'utilisateur dans la base de données
    const createdUser = await UsersModel.createFacebookUser(facebookID);

    return new User(...createdUser);

};

/**
 * Créer un utilisateur avec un Google ID.
 * @async
 * @param {string} googleID - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserGoogle = async (googleID) => {
    const createdUser = await UsersModel.createGoogleUser(googleID);
    return User(...createdUser);
};
/**
 * Mettre à jour l'ID adhérent d’un utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @param {string} adherentID - Le nouvel identifiant d'adhérent.
 * @returns {Promise<User>} L'utilisateur mis à jour.
 */
const updateUserLicence = async (userId, adherentID) => {
    const user = await  UsersModel.updateAdherantId(userId, adherentID);
    if (!user) {
        return null;
    }
    return new User(...user);
};



/**
 * Fusionner les comptes Facebook et Google d'un utilisateur.
 * @async
 * @param {number} userId1 - L'ID du premier utilisateur.
 * @param {number} userId2 - L'ID du second utilisateur.
 * @returns {Promise<User>} L'utilisateur fusionné.
 * @throws {Error} Si un des utilisateurs est introuvable ou si la fusion est impossible.
 */
const mergeUserFacebookAndGoogleIds = async (userId1, userId2) => {
    try {
        const user1 = await findUserByUserId(userId1);
        const user2 = await findUserByUserId(userId2);

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

        // Retourner un objet de type User après la fusion
        return findUserByUserId(userId1)
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