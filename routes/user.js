const express = require('express');
const router = express.Router();
const axios = require('axios')
const path = require('path');
const { getGoogleUserId , findUserByGoogleID } = require('../services/userService.js');
const Adherant = require('../models/Adherant');
const User = require("../models/Users");
const { googleAuthController ,facebookAuthController } = require("../controllers/authController");

require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const jwt = require('jsonwebtoken');


const GOOGLE_OAUTH_SCOPES = [

    "https%3A//www.googleapis.com/auth/userinfo.email",

    "https%3A//www.googleapis.com/auth/userinfo.profile",

];

const googleToken = {};

router.get('/auth', (req, res) => {
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const state = "some_state";
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ process.env.GOOGLE_OAUTH_URL}?client_id=${ process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL
    }&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

router.get("/auth/google", googleAuthController);

router.post('/auth/facebook', facebookAuthController);

router.post('/licence-check', async (req, res) => {
    const {token, service, licence} = req.body;

    console.log(`Paramètres : token=${token}, service=${service}, licence=${licence}`);

    if (!token || !service || !licence) {
        return res.status(400).json({
            error: "Paramètres requis manquant : token, service, or licence"
        });
    }

    const isLicenceValid = await Adherant.exists({_id: licence});
    if (!isLicenceValid) {
        return res.status(404).json({
            error: `Licence ${licence} introuvable }.`
        });
    }

    switch (service) {
        case 'g':
            const isTokenValidG = token in googleToken;
            if (isTokenValidG) {
                return res.status(401).json({
                    error: `Token invalide ou expiré pour le service '${service}'.`
                });
            }
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
                erorr: "Service inconnu. Veuillez fournir 'g' pour Google ou 'f' pour Facebook."
            });
    }

});



module.exports = router;
