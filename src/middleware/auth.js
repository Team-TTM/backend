const jwt = require('jsonwebtoken');
const path = require('path');
const {findUserByUserId} = require('../services/userService');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});



/**
 * Middleware d'authentification utilisant JWT.
 * Vérifie la validité du token et ajoute l'ID utilisateur à `req.auth`.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @param {import('express').NextFunction} next - Fonction pour passer au middleware suivant.
 *
 * @returns {void} - Passe au middleware suivant si l'authentification réussit, sinon redirige avec une erreur.
 */

// eslint-disable-next-line consistent-return
const authenticateJWT = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Token manquant ou invalide'});
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({message: 'Token invalide'});
        }

        req.auth = {userId: decodedToken.userId};
        next();
    } catch (error) {
        console.error('Erreur JWT:', error.message);
        return res.status(401).json({message: 'Authentification échouée'});
    }
};

// eslint-disable-next-line consistent-return
const authenticateDirigeant = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({message: 'Token manquant ou invalide'});
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        if (!decodedToken || !decodedToken.userId) {
            return res.status(401).json({message: 'Token invalide'});
        }

        const user = await findUserByUserId(decodedToken.userId);
        // const role = await getUserRole(decodedToken.userId);
        if (!user) {
            return res.status(401).json({message: 'Utilisateur non trouvé'});
        }
        if(user.role !== 'dirigeant'){
            return res.status(401).json({message: 'Vous n\'avez pas les droits pour accéder à cette ressource'});
        }

        req.auth = {userId: decodedToken.userId};
        next();
    } catch (error) {
        console.error('Erreur JWT:', error.message);
        return res.status(401).json({message: 'Authentification échouée'});
    }
};

module.exports = {authenticateJWT, authenticateDirigeant};