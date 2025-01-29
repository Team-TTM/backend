const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const passport = require('passport');
const authController = require("../controllers/authController");
const path = require("path");

router.post('/google/callback',(req, res) => {
    const url = req.url;
    const headers = req.rawHeaders;
    const body = req.body;  // Si tu as un corps de requête
    const params = req.query;  // Si tu as des paramètres de requête

    console.log('URL:', url);
    console.log('Headers:', headers);
    console.log('Body:', body);
    console.log('Params:', params);
    res.sendFile(path.join(__dirname, '..','dist', 'index.html'));
});
router.post("/auth/google", passport.authenticate('google-token', { session: false }),authController.googleAuthController);

router.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}),authController.facebookAuthController);

router.post('/licence-check',auth,authController.licenceSingInContoller);

module.exports = router;
