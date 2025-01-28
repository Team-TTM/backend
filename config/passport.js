
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleTokenStrategy = require('passport-google-token');
const { googleAuthVerify ,facebookAuthVerify} = require('../controllers/authController'); // Importer le contrôleur
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


passport.use(new FacebookTokenStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}, facebookAuthVerify));

passport.use(new GoogleTokenStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
}, googleAuthVerify));  // Utiliser le contrôleur comme callback


module.exports = passport;