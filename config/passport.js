
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const authController = require('../controllers/authController'); // Importer le contrôleur
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const userData = await authController.facebookAuthVerify(accessToken, profile);
        done(null, userData);
    } catch (error) {
        done(error, null);
    }
}));




module.exports = passport;