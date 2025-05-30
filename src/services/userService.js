const User = require('../models/entities/User');
const UserCredentialModel = require('../models/repositories/userCredentialModel');
const UsersModel = require('../models/repositories/usersModel');


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
    return user;
};

/**
 * Trouver un utilisateur par son Facebook ID.
 * @async
 * @param {string} facebookId - L'identifiant Facebook de l'utilisateur.
 * @returns {User|null} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserByFacebookId = async (facebookId) => {
    const user = await UsersModel.findUserByFacebookId(facebookId);
    if (!user) {
        return null;
    }
    return user;
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
    return user;
};


/**
 * Trouver un utilisateur credential par son mail utilisateur.
 * @async
 * @param {String} mail - Le mail de l'utilisateur.
 * @returns {Promise<UserCredential|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findByMail = async (mail) => {
    return await UserCredentialModel.findByMail(mail);
};
/**
 * Recherche un utilisateur par son numéro de licence.
 * @async
 * @param {string} numberLicence - Le numéro de licence de l'utilisateur.
 * @returns {Promise<User|null>} L'utilisateur trouvé (contenant `id_user`) ou `null` si aucun utilisateur n'est trouvé.
 * @throws {Error} En cas d'erreur lors de la requête à la base de données.
 */
const findUserByLicence = async (numberLicence) => {
    const user = await UsersModel.findUserByLicence(numberLicence);
    if (!user) {
        return null;
    }
    return user;
};

/**
 * Trouver un utilisateur par son ID utilisateur.
 * @async
 * @param {Number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<UserCredential|null>} L'utilisateur trouvé ou null s'il n'existe pas.
 */
const findUserCredentialById = async (userId) => {
    return await UserCredentialModel.findById(userId);
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
    user.userId = await UsersModel.createFacebookUser(user);
    return user;
};

const createUserLicence = async (licence) => {
    return UsersModel.createUserLicence(licence);
};

/**
 * Créer les informations d'identification d'un utilisateur.
 * @async
 * @function createUserCredential
 * @param {UserCredential} userCredential - L'objet contenant les informations d'identification de l'utilisateur.
 * @returns {Promise<UserCredential>} Les informations d'identification de l'utilisateur créées.
 */
const createUserCredential = async (userCredential) => {
    await UserCredentialModel.create(userCredential);
};

/**
 * Créer un utilisateur avec un Google ID.
 * @async
 * @param {string} googleID - L'identifiant Google de l'utilisateur.
 * @returns {Promise<User>} L'utilisateur créé.
 */
const createUserGoogle = async (googleID) => {
    const user = User.createGoogleUser(googleID);
    user.userId = await UsersModel.createGoogleUser(user);
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
    user.licenceId = adherentID;
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

    if (!user1 || !user2) {
        throw new Error('L\'un des utilisateurs est introuvable.');
    }

    const user1HasGoogle = !!user1.google_id;
    const user1HasFacebook = !!user1.facebook_id;
    const user2HasGoogle = !!user2.google_id;
    const user2HasFacebook = !!user2.facebook_id;

    if (user1HasGoogle && user2HasGoogle) {
        throw new Error('Ce numéro de licence est déjà liés à un compte Google.');
    } else if (user1HasFacebook && user2HasFacebook) {
        throw new Error('Ce numéro de licence est déjà liés à un compte Facebook.');
    } else if (!user1HasGoogle && !user1HasFacebook && !user2HasGoogle && !user2HasFacebook) {
        throw new Error(' Aucune licence n\'est lié à Google ou Facebook.');
    } else if (user1HasGoogle && user2HasFacebook) {
        user1.facebook_id = user2.facebook_id;
        await UsersModel.deleteUserById(user2);
        await UsersModel.updateFacebookId(user1);
        console.log(`✅ Fusion réussie : Google ID conservé, Facebook ID fusionné sous user ${user1.userId}`);
    } else if (user1HasFacebook && user2HasGoogle) {
        user1.google_id = user2.google_id;
        await UsersModel.deleteUserById(user2);
        await UsersModel.updateGoogleId(user1);
        console.log(`✅ Fusion réussie : Facebook ID conservé, Google ID fusionné sous user ${user1.userId}`);
    }
    return user1;

};

const deleteGoogleId = async (googleID) => {
    const user = await UsersModel.findUserByGoogleId(googleID);
    if (!user) {
        throw new Error('Utilisateur non trouver ');
    }
    user.google_id = null;
    await UsersModel.deleteGoogleId(user);
};

const updateGoogleId = async (user) => {
    await UsersModel.updateGoogleId(user);
};
const updateFacebookId = async (user) => {
    await UsersModel.updateFacebookId(user);
};

const deleteUserById = async (user) => {
    await UsersModel.deleteUserById(user);
};

const deleteFacebookId = async (facebokId) => {
    const user = await UsersModel.findUserByFacebookId(facebokId);
    if (!user) {
        throw new Error('Utilisateur non trouver ');
    }
    user.facebook_id = null;
    await UsersModel.deleteFacebookId(facebokId);
};

/**
 * Obtenir le rôle d'un utilisateur par son ID.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @returns {Promise<string>} Le rôle de l'utilisateur.
 */
const getUserRole = async (userId) => {
    return await UsersModel.getRole(userId);
};

/**
 * Vérifier si un email existe déjà dans la base de données.
 * @async
 * @param {string} mail - L'email à vérifier.
 * @returns {Promise<boolean>} `true` si l'email existe, sinon `false`.
 */
const checkIfEmailExists = async (mail) => {
    return await UserCredentialModel.findByMail(mail) !== null;
};

// ✅ Exportation des fonctions
module.exports = {
    findUserByGoogleId,
    findUserByFacebookId,
    findUserByUserId,
    findUserByLicence,
    findUserCredentialById,
    findByMail,
    createUserFacebook,
    createUserLicence,
    createUserGoogle,
    createUserCredential,
    checkIfEmailExists,
    updateUserLicence,
    updateFacebookId,
    updateGoogleId,
    mergeUserFacebookAndGoogleIds,
    deleteUserById,
    deleteGoogleId,
    deleteFacebookId,
    getUserRole,
};