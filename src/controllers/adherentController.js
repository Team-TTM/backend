const adherentsService = require('../services/adherentsService');

const getAllAdherents = async (req, res, next) => {
    try {
        console.log('📌 [CONTROLLER] Récupération des adhérents...');

        const adherents = await adherentsService.getAdherents();

        if (adherents.length === 0) {
            console.log('⚠️ Aucun adhérent trouvé.');
            return res.status(204).send(); // 204 : Pas de contenu
        }

        console.log(`✅ ${adherents.length} adhérents récupérés avec succès.`);
        res.status(200).json(adherents);
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la récupération des adhérents:', error);
        next(error); // Propagation de l'erreur vers le middleware global
    }
};

module.exports = { getAllAdherents };
