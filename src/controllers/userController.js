const userService = require ('../services/userService');

const deleteSocialAccount = async (req, res, platform) => {
    const { userId } = req.auth;
    try {
        if (platform === 'facebook') {
            await userService.deleteFacebookId(userId);
        } else {
            await userService.deleteGoogleId(userId);
        }
        return res.status(200).send({});
    } catch (error) {
        console.error(`❌ Erreur dans ${platform}AuthController:`, error);
        return res.status(500).json({ error: `Erreur lors de la suppression de l'association ${platform}` });
    }
};

const deleteGoogle = (req, res) => deleteSocialAccount(req, res, 'Google');
const deleteFacebook = (req, res) => deleteSocialAccount(req, res, 'Facebook');

export { deleteGoogle, deleteFacebook };

module.exports = {
    deleteGoogle,
    deleteFacebook
};