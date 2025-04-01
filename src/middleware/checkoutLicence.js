const {checkAdherentLicence} = require('../services/adherantService');

// eslint-disable-next-line consistent-return
const checkoutLicence = async (req, res, next) => {
    try {
        const data = req.body;
        if (!data) {
            console.error('Body de la requête vide');
            return res.status(400).json({error: 'Le body est vide'});
        }

        const {licence} = req.body;
        if (!licence) {
            console.error('Numéro de licence manquant');
            return res.status(400).json({error: 'Numéro de licence manquant'});
        }

        const licenceExists = await checkAdherentLicence(licence);
        if (!licenceExists) {
            console.error(`Licence ${licence} introuvable`);
            return res.status(404).json({error: `Licence ${licence} introuvable.`});
        }

        req.licence = licence;
        next();
    } catch (err) {
        console.error(`Erreur inattendue : ${err.message}`);
        return res.status(500).json({message: 'Une erreur inattendue est survenue'});
    }
};

module.exports = checkoutLicence;
