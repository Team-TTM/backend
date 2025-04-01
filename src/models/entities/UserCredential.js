const {hash} = require('bcrypt');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});
const saltRounds = parseInt(process.env.SALT_ROUNDS,);

/**
 * Classe représentant les informations d'identification d'un utilisateur.
 * @class
 */
class UserCredential {
    /**
     * Crée une instance de UserCredential.
     * @param {number} userId - L'ID de l'utilisateur.
     * @param {string} mail - L'email de l'utilisateur.
     * @param {string} password - Le mot de passe de l'utilisateur.
     */
    constructor(userId, mail, password) {
        this.userId = userId;
        this.mail = mail;
        this.password = password;
    }

    /**
     * Crée une instance de UserCredential à partir des données de la requête.
     * @param {Object} data - Les données de la requête.
     * @param {string} data.mail - L'email de l'utilisateur.
     * @param {string} data.password - Le mot de passe de l'utilisateur.
     * @returns {UserCredential} Une instance de UserCredential.
     * @throws {Error} Si les données sont manquantes ou invalides.
     */
    static fromRequestData(data) {
        if (!data) {
            throw new Error('Les données de la requête sont manquantes ou invalides');
        }

        if (!data.mail || !regexMail.test(data.mail)) {
            throw new Error('L\'email est manquant ou invalide');
        }

        if (!data.password || !regexPassword.test(data.password)) {
            throw new Error('Le mot de passe est manquant ou invalide');
        }

        return new UserCredential(null, data.mail, data.password);
    }

    /**
     * Crée une instance de UserCredential à partir des données de la base de données.
     * @param {Object} data - Les données de la base de données.
     * @param {number} data.user_id - L'ID de l'utilisateur.
     * @param {string} data.mail - L'email de l'utilisateur.
     * @param {string} data.password - Le mot de passe de l'utilisateur.
     * @returns {UserCredential} Une instance de UserCredential.
     */
    static fromDataBase(data) {
        return new UserCredential(data.user_id, data.mail, data.password);
    }

    /**
     * Hache le mot de passe de l'utilisateur.
     * @async
     * @function hashedPassword
     * @returns {Promise<void>}
     */
    async hashedPassword() {
        this.password = await hash(this.password, saltRounds);
    }

}

/**
 * Expression régulière pour valider les emails.
 * @constant {RegExp}
 */
const regexMail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

/**
 * Expression régulière pour valider les mots de passe.
 * @constant {RegExp}
 */
const regexPassword = /^(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{7,64}$/;
module.exports = UserCredential;