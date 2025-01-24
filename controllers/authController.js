const { getGoogleAccessToken, getGoogleUserInfo } = require("../services/googleAuthService");
const { findUserByGoogleID, createUser } = require("../services/userService");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

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

        const licenceExiste = await User.exists({ licence: { $exists: true } });

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

module.exports = { googleAuthController };