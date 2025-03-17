const adherantService = require('../services/adherantService');

const getAllAdherents = async (req, res) => {
    try {
        console.log('📌 [CONTROLLER] Récupération des adhérents...');

        const adherents = await adherantService.getAllAdherents();

        if (adherents.length === 0) {
            console.log('⚠️ Aucun adhérent trouvé.');
            return res.status(204).send(); // 204 : Pas de contenu
        }

        console.log(`✅ ${adherents.length} adhérents récupérés avec succès.`);
        return res.status(200).json(adherents);
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la récupération des adhérents:', error);
        return res.status(404).json({
            error: error.message
        });
    }
};

const getAdherent= async (req,res) => {

    const {userId} = req.auth;

    try {
        console.log(`📌 [CONTROLLER] Récupération de l'${userId} : ...`);
        console.log(userId);

        const adherents = await adherantService.getAdherent(userId);

        if (adherents.length === 0) {
            console.log('⚠️ Aucun adhérent trouvé.');
            return res.status(204).send(); // 204 : Pas de contenu
        }

        console.log(`✅ ${adherents.length} adhérents récupérés avec succès.`);
        return res.status(200).json(adherents);
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la récupération des adhérents:', error);
        return res.status(404).json({
            error: error.message
        });
    }
};

module.exports = { getAllAdherents,getAdherent };