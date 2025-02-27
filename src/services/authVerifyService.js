/**
 * @module authVerifyService
 */


const userService = require("./userService");
const {createToken} = require("./tokenService");


/**
 * Gère la vérification et l'authentification des utilisateurs via Google ou Facebook.
 *
 * @async
 * @param {"google"|"facebook"} platform - La plateforme d'authentification (Google ou Facebook).
 * @param {Object} profile - Le profil utilisateur retourné par la plateforme OAuth.
 * @param {Function} done - Callback de fin d'authentification.
 * @returns {Promise<void>} - Retourne un objet contenant le token et l'état de l'adhésion.
 */
const handleAuthVerification = async (platform, profile, done) => {
    try {
        const platformId = profile.id; // Identifiant spécifique à la plateforme (Google ou Facebook)

        // Recherche de l'utilisateur via l'ID de la plateforme
        let user;
        if (platform === 'google') {
            user = await userService.findUserByGoogleId(platformId);
        } else if (platform === 'facebook') {
            user = await userService.findUserByFacebookId(platformId);
        }

        if (!user) {
            user = platform === 'google'
                ? await userService.createUserGoogle(platformId)
                : await userService.createUserFacebook(platformId);
        }
        const isAdherent = user.numero_licence != null;

        const token = createToken(user.id_user);

        return done(null, {token, licenceExiste: isAdherent});
    } catch (error) {
        console.error(`Erreur dans ${platform} Auth:`, error);
        return done(error);
    }
};
/**
 * Vérification d'authentification via Google.
 *
 * @param {string} accessToken - Le token d'accès OAuth.
 * @param {Object} profile - Le profil utilisateur Google.
 * @param {Function} done - Callback de fin d'authentification.
 */
const googleAuthVerify = (accessToken, profile, done) => handleAuthVerification('google', profile, done);

/**
 * Vérification d'authentification via Facebook.
 *
 * @param {string} accessToken - Le token d'accès OAuth.
 * @param {Object} profile - Le profil utilisateur Facebook.
 * @param {Function} done - Callback de fin d'authentification.
 */
const facebookAuthVerify = (accessToken, profile, done) => handleAuthVerification('facebook', profile, done);

module.exports = {
    googleAuthVerify,
    facebookAuthVerify
}
