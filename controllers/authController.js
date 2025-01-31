const userService = require("../services/userService");
const {checkAdherantLicence} = require("../services/adherantService");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });



const licenceSingInContoller = async (req, res) => {
    const  {licence} = req.body;
    const {userId} = req.auth;

    if (!licence) {
        return res.status(400).json({
            error: "Paramètres requis manquant : licence"
        });
    }

    try {
        console.log(licence);
        const isLicenceValid = await checkAdherantLicence(licence);

        if (!isLicenceValid) {
            return res.status(404).json({
                error: `Licence ${licence} introuvable .`
            });
        }

        console.log("check user = ",userId);
        const isUserValid = await userService.doesUserExistById(userId);
        console.log(isUserValid);

        if (!isUserValid) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }
        const userIdexist =
            await userService.findUserByLicence(licence);

        if (userIdexist) {
            await userService.mergeUserFacebookAndGoogleIds(userIdexist, userId);
            return res.status(200).json({
                message: `Utilisateur déjà lié à la licence. Fusion des comptes réussie.`
            });
        }else {
            await userService.updateUserLicence(userId, licence);
            return res.status(200).json({
                user: await userService.findUserByUserId(userId),
                message: `Licence ${licence} associée à l'utilisateur avec succès.`
            });
        }

    } catch (error) {
        console.error("Error in Licence  :", error);
        res.status(500).json({
            error: "Une erreur s'est produite lors de l'authentification de la licence."
        });
    }
};

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
                ? await userService.createUser({ googleId: platformId })
                : await userService.createUser({ facebookId: platformId });
        }

        const licenceExiste = await userService.doesUserHaveLicence(user);

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        return done(null, { token, licenceExiste });
    } catch (error) {
        console.error(`Erreur dans ${platform} Auth:`, error);
        return done(error);
    }
};

const googleAuthVerify = (accessToken, profile, done) => handleAuthVerification('google', profile, done);
const facebookAuthVerify = (accessToken, profile, done) => handleAuthVerification('facebook', profile, done);


const handleAuthRedirection = async (req, res, platform) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const { token, licenceExiste } = req.user;

        const redirectUrl = licenceExiste
            ? `http://localhost:3000/users/connected?token=${token}`
            : `http://localhost:3000/users/verify-licence?token=${token}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error(`Erreur dans ${platform}AuthController:`, error);
        return res.status(500).json({ error: "Erreur lors de la redirection après authentification" });
    }
};


const googleAuthController = (req, res) => handleAuthRedirection(req, res, "Google");

const facebookAuthController = (req, res) => handleAuthRedirection(req, res, "Facebook");

module.exports = { googleAuthController, facebookAuthController ,googleAuthVerify,licenceSingInContoller,facebookAuthVerify};