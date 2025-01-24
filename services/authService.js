const axios = require('axios');
const User = require("../models/Users");

async function getGoogleUserId(accessToken) {
    try {
        const response = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data; // ID utilisateur Google
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur Google:', error);
        throw error;
    }
}

async function findUserByGoogleID(googleUserId) {
    try {
        const user = await     User.findOne({
                googleId : googleUserId })
        if (user) {
            console.log('Utilisateur trouvé:', user);
            return user;
        } else {
            console.log('Aucun utilisateur trouvé avec ce googleID.');
            return null;
        }
    } catch (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', err);
    }
}

async function findUserByFacebookID(FacebookeUserId) {
    try {
        const user = await User.findOne({
            facebookId: FacebookeUserId,
        });
        if (user) {
            return user;
            console.log('Utilisateur trouvé:', user);
        } else {
            return null;
            console.log('Aucun utilisateur trouvé avec cet e-mail.');
        }
    } catch (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur :', err);
    }
}

module.exports = { getGoogleUserId , findUserByGoogleID};