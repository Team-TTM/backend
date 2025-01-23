const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;

const GOOGLE_CALLBACK_URL = "http://localhost:3000/users/auth/google/callback";

const GOOGLE_OAUTH_SCOPES = [

    "https%3A//www.googleapis.com/auth/userinfo.email",

    "https%3A//www.googleapis.com/auth/userinfo.profile",

];
router.get('/auth', (req, res) => {
    const state = "some_state";
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});


router.get('/auth/google', async (req, res) => {
    console.log(req.query);
    const {code} = req.query;
    const data = {
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: 'http://localhost:3000/users/auth/google',
        grant_type: "authorization_code",
    }
    try {
        const response = await axios.post(GOOGLE_ACCESS_TOKEN_URL, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded', // Déclare que les données sont envoyées sous forme de x-www-form-urlencoded
            },
        });
        const access_token_data = response.data;
        console.log(access_token_data);
        //TODO sauvergarder le token
        //TODO ENVOYER LE TOKEN
        res.status(200).json({
            message : `connected by facebook token`
        })
    } catch (error) {
        console.error("Error fetching access token:", error);
        res.status(500).json({error: "Une erreur s'est produite lors de la récupération du token."});
    }
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

