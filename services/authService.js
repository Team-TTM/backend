const axios = require('axios');

async function getGoogleUserId(accessToken) {
    try {
        const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data.sub; // ID utilisateur Google
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur Google:', error);
        throw error;
    }
}

module.exports = { getGoogleUserId };