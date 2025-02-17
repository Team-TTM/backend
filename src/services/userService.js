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
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
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
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
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
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
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
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
};

/**
 * Créer un utilisateur avec un Facebook ID.
 * @async
 * @param {string} facebookID - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserFacebook = async (facebookID) => {
    // Appel à la méthode du modèle pour insérer l'utilisateur dans la base de données
    const user = await UsersModel.createFacebookUser(facebookID);

    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
};

/**
 * Créer un utilisateur avec un Google ID.
 * @async
 * @param {string} googleID - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserGoogle = async (googleID) => {
    const user = await UsersModel.createGoogleUser(googleID);
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
};
/**
 * Mettre à jour l'ID adhérent d’un utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @param {string} adherentID - Le nouvel identifiant d'adhérent.
 * @returns {Promise<User>} L'utilisateur mis à jour.
 */
const updateUserLicence = async (userId, adherentID) => {
    const user = await  UsersModel.updateAdherentId(userId, adherentID);
    if (!user) {
        return null;
    }
    return new User(user.id_user, user.numero_licence, user.role, user.charte_signe, user.google_id, user.facebook_id, user.newsletter);
};



/**
 * Fusionner les comptes Facebook et Google d'un utilisateur.
 * @async
 * @param {User} user1 - L'ID du premier utilisateur.
 * @param {User} user2 - L'ID du second utilisateur.
 * @returns {Promise<User>} L'utilisateur fusionné.
 * @throws {Error} Si un des utilisateurs est introuvable ou si la fusion est impossible.
 */
const mergeUserFacebookAndGoogleIds = async (user1, user2) => {
    try {

        if (!user1 || !user2) {
            throw new Error(`❌ Fusion impossible : L'un des utilisateurs (ID: ${user1.id_user}, ID: ${user2.id_user}) est introuvable.`);
        }

        const user1HasGoogle = !!user1.google_id;
        const user1HasFacebook = !!user1.facebook_id;
        const user2HasGoogle = !!user2.google_id;
        const user2HasFacebook = !!user2.facebook_id;

        if (user1HasGoogle && user2HasGoogle) {
            throw new Error(`❌ Fusion impossible : Les deux comptes (ID: ${user1.id_user}, ID: ${user2.id_user}) sont déjà liés à Google.`);
        }
        else if (user1HasFacebook && user2HasFacebook) {
            throw new Error(`❌ Fusion impossible : Les deux comptes (ID: ${user1.id_user}, ID: ${user2.id_user}) sont déjà liés à Facebook.`);
        }
        else if (!user1HasGoogle && !user1HasFacebook && !user2HasGoogle && !user2HasFacebook) {
            throw new Error(`❌ Fusion impossible : Aucun des comptes (ID: ${user1.id_user}, ID: ${user2.id_user}) n'est lié à Google ou Facebook.`);
        }
        else if (user1HasGoogle && user2HasFacebook) {
            await UsersModel.deleteUserById(user2);
            await UsersModel.updateFacebookId(user1.id_user, user2.facebook_id);
            console.log(`✅ Fusion réussie : Google ID conservé, Facebook ID fusionné sous user ${user1.id_user}`);
        }
        else if (user1HasFacebook && user2HasGoogle) {
            await UsersModel.deleteUserById(user2);
            await UsersModel.updateGoogleId(user1.id_user, user2.google_id);
            console.log(`✅ Fusion réussie : Facebook ID conservé, Google ID fusionné sous user ${user1.id_user}`);
        }
        return user1;
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