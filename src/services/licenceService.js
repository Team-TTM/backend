const userService = require('./userService');

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
    try {
        const existingUser = await userService.findUserByLicence(licence);
        if (existingUser) {

            updatedUser = await userService.mergeUserFacebookAndGoogleIds(existingUser, user);
            message = 'Fusion des comptes réussie (Facebook et Google).';
        } else {
            // Si la licence n'est pas encore associée, l'associer à l'utilisateur
            updatedUser = await userService.updateUserLicence(user, licence);
            message = `Licence ${licence} associée à l'utilisateur avec succès.`;
        }

        return {
            user: updatedUser,
            message: message,
        };
    } catch (err) {
        throw err;
    }
};

module.exports = {
    processLicenceSignIn,
};