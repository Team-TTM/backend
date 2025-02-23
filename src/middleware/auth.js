const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });



/**
 * Middleware d'authentification utilisant JWT.
 * Vérifie la validité du token et ajoute l'ID utilisateur à `req.auth`.
 *
 * @param {import("express").Request} req - Objet de requête Express.
 * @param {import("express").Response} res - Objet de réponse Express.
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant.
 *
 * @returns {void} - Passe au middleware suivant si l'authentification réussit, sinon redirige avec une erreur.
 *//**
 * Middleware d'authentification utilisant JWT.
 * Vérifie la validité du token et ajoute l'ID utilisateur à `req.auth`.
 *
 * @param {import("express").Request} req - Objet de requête Express.
 * @param {import("express").Response} res - Objet de réponse Express.
 * @param {import("express").NextFunction} next - Fonction pour passer au middleware suivant.
 *
 * @returns {void} - Passe au middleware suivant si l'authentification réussit, sinon redirige avec une erreur.
 */

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        console.error(error);
        res.status(500).redirect('/');
    }
};