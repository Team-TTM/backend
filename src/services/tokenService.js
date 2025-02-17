const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

/**
 * Crée un JSON Web Token (JWT) pour un identifiant utilisateur donné.
 *
 * @param {string} userId - L'identifiant de l'utilisateur pour lequel le token est créé.
 * @returns {string} - Le JWT généré.
 */
const createToken = (userId) => {
    return jwt.sign(
        { userId: userId},
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
};

module.exports = {createToken};
