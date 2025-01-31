const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const passport = require('passport');
const authController = require("../controllers/authController");
const path = require("path");

router.get("/auth/google", authController.googleAuthController)

router.post('/auth/facebook', passport.authenticate('facebook-token', {session: false}),authController.facebookAuthController);

router.post('/licence-check',auth,authController.licenceSingInContoller);
router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..','dist', 'index.html'));
});
module.exports = router;
