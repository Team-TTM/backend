const UsersModel = require("../models/usersModel");
const User = require("../models/User");


/**
 * Trouver un utilisateur par son Google ID.
 * @async
 * @param {string} googleId - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByGoogleId = async (googleId) => {
    const userData = await UsersModel.findUserByGoogleId(googleId);
    if (!userData) {
        return null;
    }
};

/**
 * Trouver un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByFacebookId = async (facebookId) => {
    const userData =  await UsersModel.findUserByFacebookId(facebookId);
    if (!userData) {
        return null;
    }
};

/**
 * Trouver un utilisateur par son ID utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByUserId = async (userId) => {
    const userData = await UsersModel.findUserById(userId);
    if (!userData) {
        return null;
    }
    // Retourner un objet de type User
    return User.createUserFromDataBase(userData);
};

/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numberLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numberLicence) => {
    const userData = await  UsersModel.findUserByLicence(numberLicence);
    if (!userData) {
        return null;
    }
    return User.createUserFromDataBase(userData)
};

/**
 * Créer un utilisateur avec un Facebook ID.
 * @async
 * @param {string} facebookID - L'identifiant Facebook de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserFacebook = async (facebookID) => {
    // Appel à la méthode du modèle pour insérer l'utilisateur dans la base de données
    const user = User.createFacebookUser(facebookID);
    user.id_user  = await UsersModel.createFacebookUser(user);
    return user;
};

/**
 * Créer un utilisateur avec un Google ID.
 * @async
 * @param {string} googleID - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserGoogle = async (googleID) => {
    const user = User.createGoogleUser(googleID);
    user.id_user  = await UsersModel.createGoogleUser(user);
    return user;
};
/**
 * Mettre à jour l'ID adhérent d’un utilisateur.
 * @async
 * @param {User} user - L'identifiant de l'utilisateur.
 * @param {string} adherentID - Le nouvel identifiant d'adhérent.
 * @returns {Promise<User>} L'utilisateur mis à jour.
 */
const updateUserLicence = async (user, adherentID) => {
    user.numero_licence = adherentID
    await UsersModel.updateAdherentId(user);
    return user;
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
            throw new Error(`❌ Fusion impossible : Ce numéro de licence est déjà liés à un compte Google.`);
        }
        else if (user1HasFacebook && user2HasFacebook) {
            throw new Error(`❌ Fusion impossible : Les deux comptes (ID: ${user1.id_user}, ID: ${user2.id_user}) sont déjà liés à Facebook.`);
        }
        else if (!user1HasGoogle && !user1HasFacebook && !user2HasGoogle && !user2HasFacebook) {
            throw new Error(`❌ Fusion impossible : Aucun des comptes (ID: ${user1.id_user}, ID: ${user2.id_user}) n'est lié à Google ou Facebook.`);
        }
        else if (user1HasGoogle && user2HasFacebook) {
            user1.facebook_id = user2.facebook_id;
            await UsersModel.deleteUserById(user2);
            await UsersModel.updateFacebookId(user1);
            console.log(`✅ Fusion réussie : Google ID conservé, Facebook ID fusionné sous user ${user1.id_user}`);
        }
        else if (user1HasFacebook && user2HasGoogle) {
            user1.google_id = user2.google_id
            await UsersModel.deleteUserById(user2);
            await UsersModel.updateGoogleId(user1);
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