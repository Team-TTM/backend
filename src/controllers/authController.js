const userService = require("../services/userService");
const {checkAdherantLicence} = require("../services/adherantService");
const {createToken} = require("../services/tokenService");




const licenceSignInController = async (req, res) => {
    const { licence } = req.body;
    const { userId } = req.auth;

    if (!licence) {
        return res.status(400).json({
            error: "Le paramètre 'licence' est requis."
        });
    }

    try {
        const isLicenceValid = await checkAdherantLicence(licence);

        if (!isLicenceValid) {
            return res.status(404).json({
                error: `Licence ${licence} introuvable.`
            });
        }

        const user = await userService.findUserByUserId(userId);
        if (!user) {
            return res.status(403).json({ error: "Utilisateur non trouvé." });
        }

        const existingUser = await userService.findUserByLicence(licence);
        if (existingUser) {
            if ((user.googleId && existingUser.facebookId && !user.facebookId &&  !existingUser.googleId) ||
                (user.facebookId && existingUser.googleId && !user.googleId &&  !existingUser.facebookId )){
                // Fusionner les comptes si l'un est Google et l'autre est Facebook
                await userService.mergeUserFacebookAndGoogleIds(existingUser, userId);
                const token = createToken(existingUser._id);
                const updatedUser = await userService.findUserByUserId(existingUser._id);

                return res.status(201).json({
                    token,
                    user: updatedUser,
                    message: `Fusion des comptes réussie (Facebook et Google).`
                });
            } else {
                return res.status(402).json({
                    error: "Fusion impossible : deux comptes du même type (Facebook ou Google) détectés."
                });
            }
        } else {
            // Si la licence n'est pas encore associée, l'associer à l'utilisateur
            await userService.updateUserLicence(userId, licence);
            const updatedUser = await userService.findUserByUserId(userId);

            return res.status(200).json({
                user: updatedUser,
                message: `Licence ${licence} associée à l'utilisateur avec succès.`
            });
        }

    } catch (error) {
        console.error("Erreur dans l'authentification de la licence pour l'utilisateur", userId, error);
        res.status(500).json({
            error: "Une erreur s'est produite lors de l'authentification de la licence."
        });
    }
};

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
        return res.status(501).json({ error: "Erreur lors de la redirection après authentification" });
    }
};


const googleAuthController = (req, res) => handleAuthRedirection(req, res, "Google");

const facebookAuthController = (req, res) => handleAuthRedirection(req, res, "Facebook");

module.exports = { googleAuthController, facebookAuthController ,licenceSignInController};