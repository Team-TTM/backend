const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const path = require("path");
const {facebookAuthVerify, googleAuthVerify} = require("../controllers/authController");
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,

}, async (accessToken, refreshToken, profile, done) => {
    try {
        await facebookAuthVerify(accessToken, profile, done);
    } catch (error) {
        done(error, null);
    }
}));


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    scope: ["email", "profile", "openid"],
}, async (accessToken, refreshToken, profile, done) => {
    try {
        await googleAuthVerify(accessToken, profile, done);
    } catch (error) {
        done(error);
    }
}));


module.exports = passport;