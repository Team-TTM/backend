const express = require('express');
const router = express.Router();

router.post('/auth/google', (req, res) => {
    const token = req.body.token;
    if (!token) {
        return res.status(400).json({
            error:"Le token Google est requis pour l'authentification."
        });
    }

    console.log(`Paramètres : token=${token},`);


    // TODO: Ajouter la logique pour vérifier et valider le token Google
    const isValidToken = false;

    if (!isValidToken) {
        return res.status(401).json({
            error: "Le token Google est invalide ou expiré."
        });
    }
    // TODO sauvergarder le token
    res.status(200).json({
        message:
            `connected by google`
    });
});
router.post('/auth/facebook', (req, res) => {
    const token = req.body;
    if (!token) {
        return res.status(400).json({
            error: "Le token Facebook est requis pour l'authentification."
        });
    }
    console.log(`Paramètres : token=${token},`);

    // TODO: Ajouter la logique pour vérifier et valider le token Facebook
    const isValidToken = true;
    if (!isValidToken) {
        return res.status(401).json({
            error: "Le token Facebook est invalide ou expiré."
        });
    }
    // TODO sauvergarder le token
    res.status(200).json({
       message : `connected by facebook token`
    })

});
router.post('/licence-check', (req, res) => {
    const { token, service, licence } = req.body;

    console.log(`Paramètres : token=${token}, service=${service}, licence=${licence}`);

    if (!token || !service || !licence) {
        return res.status(400).json({
            error:"Paramètres requis manquant : token, service, or licence"
        });
    }

    // TODO: Ajouter la logique pour vérifier la licence dans la base de données
    const isLicenceValid = true;

    if (!isLicenceValid) {
        return res.status(404).json({
            error: `Licence ${licence} introuvable }.`
        });
    }

    switch (service) {
        case 'g':
            const isTokenValidG = true
            if (!isTokenValidG) {
                return res.status(401).json({
                    error: `Token invalide ou expiré pour le service '${service}'.`
                });
            }
            //TODO liée le numero de licence au token de l'utilisateur
            //TODO check cadre
            res.status(200).json({
                message: `Licence checked for token ${token} and service ${service}`
            });
            break;
        case 'f':
            const isTokenValidF = true
            if (!isTokenValidF) {
                return res.status(401).json({
                    error: `Token invalide ou expiré pour le service '${service}'.`
                });
            }
            //TODO liée le numero de licence au token de l'utilisateur
            //TODO liée le numero de licene au token facebook

            res.status(200).json({
                message: `Licence checked for token ${token} and service ${service}`
            });
            break;
        default:
            res.status(400).json({
                erorr:"Service inconnu. Veuillez fournir 'g' pour Google ou 'f' pour Facebook."
            });
    }

});

router.get('/auth', (req, res) => {
    // TODO retourné la page de connexion
});

module.exports = router;

