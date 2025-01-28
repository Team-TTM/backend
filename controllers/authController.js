const userService = require("../services/userService");
const {checkAdherantLicence} = require("../services/adherantService");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const googleAuthVerify = async (accessToken, profile) => {
    try {
        let user = await userService.findUserByGoogleId(profile.id);

        if (!user) {
            user = await userService.createUser({googleId: profile.id});
        }

        const licenceExiste = await userService.doesUserHaveLicence(user);

        // Générer un token JWT
        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );
        return done(null, {token, licenceExiste });
    } catch (error) {
        console.error("Erreur dans Facebook Auth:", error);
        return done(error);
    }
};



const facebookAuthVerify = async (accessToken, profile) => {
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
    if (!req.user) {
        return res.status(401).json({ error: "Échec de l'authentification Facebook." });
    }
    const {token, licenceExiste } = req.user;
    return res.json({
        token,
        message: "Connecté by Facebook",
        licence: licenceExiste
    });
};
const googleAuthController = (req, res) => {
    if (req.user) {
        const { token, licenceExiste } = req.user;
        res.status(200).json({
            token,
            message: "Connecté by Facebook",
            licenceExiste
        });
    } else {
        res.status(400).json({ error: 'Échec de l\'authentification Google' });
    }
};

module.exports = { googleAuthController, facebookAuthController ,licenceSingInContoller,facebookAuthVerify,googleAuthVerify};