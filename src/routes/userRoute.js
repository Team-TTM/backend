const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const adherentController = require('../controllers/adherentController');
const path = require('path');
const userController = require('../controllers/userController');
const {authenticateJWT} = require('../middleware/auth');


router.get('/auth/google', passport.authenticate('google'));

router.delete('/google',authenticateJWT,userController.deleteGoogle);

router.delete('/facebook',authenticateJWT,userController.deleteFacebook);

router.get('/auth/google/callback', passport.authenticate('google', {session: false}), authController.googleAuthController);

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {session: false}),authController.facebookAuthController);

router.post('/licence-check',authenticateJWT,authController.licenceSignInController);

router.get('/getAllAdherents',authenticateJWT,adherentController.getAllAdherents);

router.get('/adherent',authenticateJWT,adherentController.getAdherent);




router.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..','..','..','frontend','dist', 'index.html'));
});
module.exports = router;
