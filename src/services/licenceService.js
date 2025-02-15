const userService = require("./userService");
const {checkAdherantLicence} = require("./adherantService");
const {createToken} = require("./tokenService");

/**
 * Vérifie et associe une licence à un utilisateur.
 * @async
 * @param {number} userId - L'identifiant de l'utilisateur.
 * @param {string} licence - Le numéro de licence à vérifier et associer.
 * @returns {Promise<Object>} L'utilisateur mis à jour et un message de confirmation.
 * @throws {Error} Si la licence est invalide ou si une erreur survient.
 */
const processLicenceSignIn = async (userId, licence) => {
    const isLicenceValid = await checkAdherantLicence(licence);

    if (!isLicenceValid) {
        throw new Error(`Licence ${licence} introuvable.`);
    }

    const user = await userService.findUserByUserId(userId);
    if (!user) {
        throw new Error("Utilisateur non trouvé.");
    }

    const existingUser = await userService.findUserByLicence(licence);
    if (existingUser) {
        const newUserId = existingUser.id_user
        await userService.mergeUserFacebookAndGoogleIds(newUserId, userId);
        const token = createToken(newUserId);
        const updatedUser = await userService.findUserByUserId(newUserId);

        return {
            token,
            user: updatedUser,
            message: `Fusion des comptes réussie (Facebook et Google).`
        };
    } else {
        // Si la licence n'est pas encore associée, l'associer à l'utilisateur
        await userService.updateUserLicence(userId, licence);
        const updatedUser = await userService.findUserByUserId(userId);

        return {
            user: updatedUser,
            message: `Licence ${licence} associée à l'utilisateur avec succès.`
        };
    }
};

module.exports = {
    processLicenceSignIn,
};