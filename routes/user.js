const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const passport = require('passport');
const authController = require("../controllers/authController");



// router.get('/auth',authRedirectController );

router.post("/auth/google", passport.authenticate('google-token', { session: false }),authController.googleAuthController);

router.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}),authController.facebookAuthController);

router.post('/licence-check',auth,authController.licenceSingInContoller);

module.exports = router;
