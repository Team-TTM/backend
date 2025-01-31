const axios = require("axios");

const getGoogleAccessToken = async (code) => {
    try {
        const response = await axios.post(process.env.GOOGLE_ACCESS_TOKEN_URL, {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_CALLBACK_URL,
            grant_type: "authorization_code",
        }, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error fetching Google access token:", error);
        return null;
    }
};

const getGoogleUserInfo = async (access_token) => {
    try {
        const response = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching Google user info:", error);
        return null;
    }
};

module.exports = { getGoogleAccessToken, getGoogleUserInfo };