const userService = require("./userService");
const {createToken} = require("./tokenService");
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
                ? await userService.createUser({googleId: platformId})
                : await userService.createUser({facebookId: platformId});
        }

        const licenceExiste = await userService.doesUserHaveLicence(user._id);

        const token = createToken(user._id);

        return done(null, {token, licenceExiste});
    } catch (error) {
        console.error(`Erreur dans ${platform} Auth:`, error);
        return done(error);
    }
};

const googleAuthVerify = (accessToken, profile, done) => handleAuthVerification('google', profile, done);
const facebookAuthVerify = (accessToken, profile, done) => handleAuthVerification('facebook', profile, done);

module.exports = {
    googleAuthVerify,
    facebookAuthVerify
}
