const express = require('express');
const router = express.Router();
const path = require('path');
const {signUpController, signInController} = require('../controllers/authController');
const validateUserCredentialData = require('../middleware/validateUserData');


router.post('/sign-up', validateUserCredentialData, signUpController);

router.post('/sign-in', validateUserCredentialData, signInController);

router.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'));
});

module.exports = router;
