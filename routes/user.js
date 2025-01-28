const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const passport = require('passport');
const { googleAuthController ,facebookAuthController ,licenceSingInContoller} = require("../controllers/authController");



// router.get('/auth',authRedirectController );

router.post("/auth/google", googleAuthController);

router.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}),facebookAuthController);

router.post('/licence-check',auth,licenceSingInContoller);

module.exports = router;
