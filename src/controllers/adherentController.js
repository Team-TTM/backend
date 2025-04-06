const adherantService = require('../services/adherantService');
const {findUserById} = require('../models/repositories/usersModel');

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
    const {userId} = req.auth;
    try {
        console.log(`📌 [CONTROLLER] Mise à jour de l'adhérent ${userId} : ...`);
        const adherentRequest = req.body.adherent;
        const user = await findUserById(userId);
        console.log(adherentRequest);
        if (user.licenceId !== adherentRequest.numeroLicence) {
            return res.status(400).json({
                error: 'Le numero de licence ne correspond pas a l\'utilisateur.'
            });
        }

        const adherent = await adherantService.recupAdherent(userId)

        ;
        if (!adherent) {
            return res.status(400).json({
                error: 'Adherent non trouvé'
            });
        }
        if (adherentRequest.nom !== undefined) {
            adherent.nom = adherentRequest.nom;
        }
        if (adherentRequest.prenom !== undefined) {
            adherent.prenom = adherentRequest.prenom;
        }
        if (adherentRequest.genre !== undefined) {
            adherent.genre = adherentRequest.genre;
        }
        if (adherentRequest.email !== undefined) {
            adherent.email = adherentRequest.email;
        }
        if (adherentRequest.dateNaissance !== undefined) {
            adherent.dateNaissance = adherentRequest.dateNaissance;
        }
        if (adherentRequest.telephone !== undefined) {
            adherent.telephone = adherentRequest.telephone;
        }
        if (adherentRequest.urgenceTelephone !== undefined) {
            adherent.urgenceTelephone = adherentRequest.urgenceTelephone;
        }
        await adherantService.editAdherent(adherent);
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