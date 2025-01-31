const userService = require("../services/userService");
const {checkAdherantLicence} = require("../services/adherantService");
const jwt = require("jsonwebtoken");
const path = require("path");
const {getGoogleAccessToken, getGoogleUserInfo} = require("../services/googleAuthService");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });





const facebookAuthVerify = async (accessToken, profile,done) => {
    try {

        const facebookId = profile.id;

        let user = await userService.findUserByFacebookId(facebookId);
        if (!user) {
            user = await userService.createUser({ facebookId });
        }

        const licenceExiste = await userService.doesUserHaveLicence(user);

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        // Retourner l'utilisateur avec les infos nécessaires
        return done(null, {token, licenceExiste });
    } catch (error) {
        console.error("Erreur dans Facebook Auth:", error);
        return done(error);
    }
};


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

const facebookAuthController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const { token, licenceExiste } = req.user;
        const redirectUrl = licenceExiste
            ? `http://localhost:3000/users/connected?token=${token}`
            : `http://localhost:3000/users/verify-licence?token=${token}`; // Correction ici : demande la licence si elle n'existe pas

        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Erreur dans facebookAuthController:", error);
        res.status(500).json({ error: "Erreur lors de la redirection après authentification" });
    }
};

const googleAuthController3 = async (req, res) => {
    try {
        const { code } = req.query;

        const access_token = await getGoogleAccessToken(code);
        if (!access_token) {
            return res.status(500).json({ error: "Échec de récupération du token Google" });
        }

        const userInfo = await getGoogleUserInfo(access_token);
        if (!userInfo?.sub) {
            return res.status(500).json({ error: "Impossible de récupérer l'ID utilisateur Google." });
        }

        let user =
            await userService.findUserByGoogleId(userInfo.sub);
        if (!user) {
            user = await userService.createUser({ googleId: userInfo.sub });
        }

        const licenceExiste = await userService.doesUserHaveLicence(user);
        const token = jwt.sign(
            { userId: user._id.toString()},
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        if (licenceExiste) {
            res.redirect(`http://localhost:3000/users/connected?token=${token}`);
        }else{
            res.redirect(`http://localhost:3000/users/verify-licence?token=${token}`);
        }

    } catch (error) {
        console.error("Error in Google Auth:", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'authentification Google." });
    }
};


const googleAuthVerify = async (accessToken, profile, done) => {
    try {
        const googleId = profile.id;

        let user = await userService.findUserByGoogleId(googleId); // Correction ici : `findUserByGoogleId` au lieu de `findUserByFacebookId`
        if (!user) {
            user = await userService.createUser({ googleId });
        }

        const licenceExiste = await userService.doesUserHaveLicence(user);

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // Retourner l'utilisateur avec les infos nécessaires
        return done(null, { token, licenceExiste });
    } catch (error) {
        console.error("Erreur dans Google Auth:", error);
        return done(error);
    }
};

const googleAuthController = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Utilisateur non authentifié" });
        }

        const { token, licenceExiste } = req.user;
        const redirectUrl = licenceExiste
            ? `http://localhost:3000/users/connected?token=${token}`
            : `http://localhost:3000/users/verify-licence?token=${token}`; // Correction ici : demande la licence si elle n'existe pas

        res.redirect(redirectUrl);
    } catch (error) {
        console.error("Erreur dans googleAuthController:", error);
        res.status(500).json({ error: "Erreur lors de la redirection après authentification" });
    }
};

module.exports = { googleAuthController, facebookAuthController ,googleAuthVerify,licenceSingInContoller,facebookAuthVerify};