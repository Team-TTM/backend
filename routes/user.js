const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const { googleAuthController ,facebookAuthController ,licenceSingInContoller,authRedirectController } = require("../controllers/authController");



// router.get('/auth',authRedirectController );

router.post("/auth/google", googleAuthController);

router.get('/auth/facebook', facebookAuthController);

router.post('/licence-check',auth,licenceSingInContoller);

module.exports = router;
