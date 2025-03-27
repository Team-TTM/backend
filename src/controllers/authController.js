/**
 * @module authController
 */


const licenceService = require('../services/licenceService');
const {createToken} = require('../services/tokenService');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const userService = require('../services/userService');
const {compare} = require('bcrypt');
const UserService = require('../services/userService');

const URL = process.env.URL;


/**
 * Contrôleur pour la connexion via une licence d'adhérent.
 * @async
 * @function licenceSignInController
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} req.body - Le corps de la requête.
 * @param {string} req.licence - La licence de l'utilisateur.
 * @param {Object} req.auth - L'objet d'authentification.
 * @param {number} req.auth.userId - L'ID de l'utilisateur authentifié.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une réponse JSON avec un message de confirmation ou une erreur.
 */
const licenceSignInController = async (req, res) => {
    const {licence} = req.licence;
    const {userId} = req.auth;

    try {
        const {user, message} = await licenceService.processLicenceSignIn(userId, licence);
        const token = createToken(user.id_user);
        return res.status(200).json({token, message});
    } catch (error) {
        console.error('❌ Erreur dans l\'authentification de la licence :', error);
        return res.status(400).json({
            error: error.message
        });
    }
};

/**
 * Gère la redirection après authentification via une plateforme (Google ou Facebook).
 * @async
 * @function handleAuthRedirection
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @param {string} platform - La plateforme d'authentification ('Google' ou 'Facebook').
 * @returns {Promise<Response>} Une redirection vers l'URL appropriée ou une réponse JSON en cas d'erreur.
 */
const handleAuthRedirection = async (req, res, platform) => {
    try {
        if (!req.user) {
            return res.status(401).json({error: 'Utilisateur non authentifié'});
        }
        const {token, licenceExiste} = req.user;

        const redirectUrl = licenceExiste
            ? `${URL}/users/HomePage?token=${token}`
            : `${URL}/users/verify-licence?token=${token}`;

        return res.redirect(redirectUrl);
    } catch (error) {
        console.error(`Erreur dans ${platform}AuthController:`, error);
        return res.status(501).json({error: 'Erreur lors de la redirection après authentification'});
    }
};


/**
 * Contrôleur pour l'authentification via Google.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une redirection après authentification Google.
 */
const googleAuthController = (req, res) => handleAuthRedirection(req, res, 'Google');
/**
 * Contrôleur pour l'authentification via Facebook.
 * @param {Object} req - L'objet de requête Express.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une redirection après authentification Facebook.
 */
const facebookAuthController = (req, res) => handleAuthRedirection(req, res, 'Facebook');


/**
 * Contrôleur pour la connexion d'un utilisateur.
 * Vérifie si l'email existe dans la base de données et si le mot de passe est correct.
 * Si la connexion réussie, un token est généré et renvoyé dans l'en-tête.
 * Si l'utilisateur n'a pas de licence, un champ `requiresVerification` est renvoyé.
 *
 * @async
 * @function signInController
 * @param {Object} req - L'objet de la requête Express.
 * @param {UserCredential} req.userCredential - L'objet contenant les informations d'identification de l'utilisateur (email, mot de passe).
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une réponse JSON avec un token d'authentification et un statut de vérification.
 */
const signInController = async (req, res) => {
    const userCredential = req.userCredential;
    try {
        const userCredentialFetch = await UserService.findByMail(userCredential.mail);
        if (userCredentialFetch) {
            const match = await compare(userCredential.password, userCredentialFetch.password);
            if (match) {
                const token = createToken(userCredentialFetch.userId);
                res.setHeader('Authorization', `Bearer ${token}`);
                return res.status(200).json();
            } else {
                return res.status(401).json({error: 'Mot de passe incorrecte'});
            }
        } else {
            return res.status(422).json({error: 'Aucun compte mail associer ce mail'});
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Une erreur inattendue est survenue'});
    }
};

/**
 * Contrôleur pour l'inscription d'un nouvel utilisateur.
 * Vérifie si l'email existe déjà dans la base de données.
 * Si l'email est unique, crée l'utilisateur et renvoie un token d'authentification.
 * Si l'email est déjà associé à un autre compte, retourne une erreur.
 *
 * @async
 * @function signUpController
 * @param {Object} req - L'objet de la requête Express.
 * @param {UserCredential} req.userCredential - L'objet contenant les informations d'identification de l'utilisateur (email, mot de passe).
 * @param {string} req.licence - La licence de l'utilisateur.
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<Response>} Une réponse JSON avec un token d'authentification ou un message d'erreur.
 */
const signUpController = async (req, res) => {
    const newUserCredential = req.userCredential;
    const licence = req.licence;
    try {
        const emailExists = await userService.checkIfEmailExists(newUserCredential.mail);
        if (emailExists) {
            return res.status(409).json({error: 'Cet email est déjà associé à un autre compte'});
        }
        const userFromLicence = await userService.findUserByLicence(licence);
        if (userFromLicence) {
            const existingUserCredential = await userService.findUserCredentialById(userFromLicence.id_user);
            if (existingUserCredential) {
                return res.status(409).json({error: 'Ce numéro de licence est déjà associé à un autre compte'});
            } else {
                newUserCredential.userId = userFromLicence.id_user;
            }
        } else {
            newUserCredential.userId = await UserService.createUserLicence(licence);
        }
        await newUserCredential.hashedPassword();
        await userService.createUserCredential(newUserCredential);
        const token = createToken(newUserCredential.userId);
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.status(201).send();
    } catch (err) {
        console.error(err);
        return res.status(500).json({error: 'Une erreur inattendue est survenue'});
    }
};

module.exports = {
    googleAuthController,
    facebookAuthController,
    licenceSignInController,
    signUpController,
    signInController
};