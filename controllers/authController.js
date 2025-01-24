const { getGoogleAccessToken, getGoogleUserInfo } = require("../services/googleAuthService");
const { findUserByGoogleID, findUserByFacebookID, createUser ,checkLicence} = require("../services/userService");
const jwt = require("jsonwebtoken");

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

        let user = await findUserByGoogleID(userInfo.sub);
        if (!user) {
            user = await createUser({ googleId: userInfo.sub });
        }

        const licenceExiste = await checkLicence(user);

        const token = jwt.sign(
            { userID: user._id },
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

        let user = await findUserByFacebookID(userInfo.sub);
        if (!user) {
            user = await createUser({ facebookId: userInfo.sub });
        }

        const licenceExiste = await checkLicence(user);

        const token = jwt.sign(
            { userID: user._id },
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
        console.error("Error in Google Auth:", error);
        res.status(500).json({ error: "Une erreur s'est produite lors de l'authentification Facebook." });
    }
};

module.exports = { googleAuthController, facebookAuthController };