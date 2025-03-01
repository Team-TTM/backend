const express = require('express');
const router = express.Router();
const passport = require('passport');
authenticateJWT = require('../middleware/auth');
const authController = require('../controllers/authController');
const path = require('path');


router.get('/auth/google', passport.authenticate('google'));

router.get('/auth/google/callback', passport.authenticate('google', {session: false}), authController.googleAuthController);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false}), authController.facebookAuthController);

router.post('/licence-check', authenticateJWT, authController.licenceSignInController);

router.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'dist', 'index.html'));
});
module.exports = router;
