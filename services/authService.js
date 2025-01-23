const axios = require('axios');

async function getGoogleUserId(accessToken) {
    try {
        const response = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        console.log("sfdjklfdsjkfjkslfkjls")
        return response.data.sub; // ID utilisateur Google
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'ID utilisateur Google:', error);
        throw error;
    }
}

module.exports = { getGoogleUserId };