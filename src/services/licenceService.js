const userService = require('./userService');
const userCredentailModel = require('../models/repositories/userCredentialModel');
const {deleteUserById} = require('./userService');

/**
 * Vérifie et associe une licence à un utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @param {string} licence - Le numéro de licence à vérifier et associer.
 * @returns {Promise<Object>} L'utilisateur mis à jour et un message de confirmation.
 * @throws {Error} Si la licence est invalide ou si une erreur survient.
 */
const processLicenceSignIn = async (userId, licence) => {
    let updatedUser;
    let message;
    const user = await userService.findUserByUserId(userId);
    if (!user) {
        throw new Error('Utilisateur non trouvé.');
    }
    const existingUser = await userService.findUserByLicence(licence);
    if (existingUser) {
        const userCredential = await userCredentailModel.findById(existingUser.id_user);
        if (userCredential) {
            if (user.google_id && !existingUser.google_id) {
                // TODO verifi sin on ecrase pas un compte google
                await userService.deleteUserById(user);
                existingUser.google_id = user.google_id;
                await userService.updateGoogleId(existingUser);
                message = 'Fusion Google et mail';
            } else if (user.facebook_id && !existingUser.facebook_id) {
                existingUser.facebook_id = existingUser.facebook_id;
                await userService.deleteUserById(user);
                await userService.updateFacebookId(existingUser);
                message = 'Fusion Facebook et mail';
            } else {
                throw new Error('Cette licence est deja associé un compte');
            }
            updatedUser = existingUser;
        } else {
            updatedUser = await userService.mergeUserFacebookAndGoogleIds(existingUser, user);
            message = 'Fusion Google et Facebook';
        }
    } else {
        updatedUser = await userService.updateUserLicence(user, licence);
        message = `Licence ${licence} associée à l'utilisateur avec succès.`;
    }

    return {
        user: updatedUser,
        message: message,
    };
};

module.exports = {
    processLicenceSignIn,
};