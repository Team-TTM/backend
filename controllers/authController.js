const { getGoogleAccessToken, getGoogleUserInfo } = require("../services/googleAuthService");
const {
    findUserByGoogleId,
    findUserByLicence,
    findUserByFacebookId,
    createUser,
    doesUserHaveLicence,
    doesUserExistById,
    updateUserLicence,
    mergeUserFacebookAndGoogleIds,
    findUserByUserId} = require("../services/userService");
const {checkAdherantLicence} = require("../services/AdherantService");
const jwt = require("jsonwebtoken");
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const googleAuthController = async (req, res) => {
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
            await findUserByGoogleId(userInfo.sub);
        if (!user) {
            user = await createUser({ googleId: userInfo.sub });
        }

        const licenceExiste = await doesUserHaveLicence(user);
        console.log("user = ", user);
        console.log("user id = ", user._id);
        const token = jwt.sign(
            { userId: user._id.toString()},
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            token,
            message: licenceExiste
                ? "Connecté avec Google"
                : "Connecté avec Google, vérification de la licence nécessaire",
        });

    } catch (error) {
        console.error("Error in Google Auth:", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'authentification Google." });
    }
};


const facebookAuthController = async (req, res) => {
    try {
        const { code } = req.query;

        // TODO
        const access_token = await getGoogleAccessToken(code);
        if (!access_token) {
            return res.status(500).json({ error: "Échec de récupération du token Facebook" });
        }

        const userInfo = await getGoogleUserInfo(access_token);
        // TODO
        if (!userInfo?.sub) {
            return res.status(500).json({ error: "Impossible de récupérer l'ID utilisateur Facebook." });
        }

        let user =
            await findUserByFacebookId(userInfo.sub);
        if (!user) {
            user = await createUser({ facebookId: userInfo.sub });
        }

        const licenceExiste = await doesUserHaveLicence(user);

        const token = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.status(200).json({
            token,
            message: licenceExiste
                ? "Connecté avec Facebook"
                : "Connecté avec Facebook , vérification de la licence nécessaire",
        });

    } catch (error) {
        console.error("Error in Facebook Auth:", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'authentification Facebook." });
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

        const isLicenceValid = await checkAdherantLicence(licence);

        if (!isLicenceValid) {
            return res.status(404).json({
                error: `Licence ${licence} introuvable .`
            });
        }

        console.log("check user = ",userId);
        const isUserValid = await doesUserExistById(userId);
        console.log(isUserValid);

        if (!isUserValid) {
            return res.status(404).json({
                error: "Utilisateur introuvable"
            });
        }
        const userIdexist =
            await findUserByLicence(licence);

        if (userIdexist) {
            await mergeUserFacebookAndGoogleIds(userIdexist, userId);
            return res.status(200).json({
                message: `Utilisateur déjà lié à la licence. Fusion des comptes réussie.`
            });
        }else {
            await updateUserLicence(userId, licence);
            return res.status(200).json({
                user: await findUserByUserId(userId),
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

module.exports = { googleAuthController, facebookAuthController ,licenceSingInContoller};