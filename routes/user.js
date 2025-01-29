const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const passport = require('passport');
const authController = require("../controllers/authController");
const path = require("path");


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
