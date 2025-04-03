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

const updateAdherent = async (req, res) => {
    const { userId } = req.auth; // Récupère l'ID utilisateur authentifié

    try {
        console.log(`📌 [CONTROLLER] Mise à jour de l'adhérent ${userId} : ...`);
        console.log(userId);

        const adherent = req.body;

        if (!adherent || !adherent.numeroLicence || !adherent.getDerniereSaison()) {
            console.log('⚠️ Les informations de l\'adhérent sont incomplètes.');
            return res.status(400).json({
                error: 'Les informations de l\'adhérent sont incomplètes.'
            });
        }

        const isAdherentUpdated = await adherantService.updateAdherent(adherent);

        if (!isAdherentUpdated) {
            console.log('⚠️ La mise à jour n\'a pas été effectuée.');
            return res.status(204).send(); // Pas de contenu
        }

        console.log('✅ Adhérent mis à jour avec succès.');
        return res.status(200).json({ message: 'Adhérent mis à jour avec succès.' });

    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la mise à jour de l\'adhérent:', error);
        return res.status(500).json({
            error: error.message || 'Une erreur est survenue lors de la mise à jour de l\'adhérent.'
        });
    }
};


module.exports = { getAllAdherents,getAdherent,updateAdherent };