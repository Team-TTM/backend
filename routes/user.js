const express = require('express');
const router = express.Router();
const path = require('path');
const auth = require('../middleware/auth')
const { googleAuthController ,facebookAuthController ,licenceSingInContoller } = require("../controllers/authController");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const GOOGLE_OAUTH_SCOPES = [

    "https%3A//www.googleapis.com/auth/userinfo.email",

    "https%3A//www.googleapis.com/auth/userinfo.profile",

];

router.get('/auth', (req, res) => {
    const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
    const state = "some_state";
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${ process.env.GOOGLE_OAUTH_URL}?client_id=${ process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL
    }&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
});

router.get("/auth/google", googleAuthController);

router.get('/auth/facebook', facebookAuthController);

router.post('/licence-check',auth,licenceSingInContoller);

module.exports = router;
