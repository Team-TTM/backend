const UsersModel = require("../models/usersModel");

// 🔹 Trouver un utilisateur par son Google ID
const findUserByGoogleId = async (googleId) => {
    return UsersModel.findUserByGoogleId(googleId);
};

// 🔹 Trouver un utilisateur par son Facebook ID
const findUserByFacebookId = async (facebookId) => {
    return UsersModel.findUserByFacebookId(facebookId);
};

// 🔹 Trouver un utilisateur par son ID utilisateur
const findUserByUserId = async (userId) => {
    return UsersModel.findUserById(userId);
};

// 🔹 Créer un utilisateur avec un Facebook ID
const createUserFacebook = async (facebookID) => {
    return UsersModel.createFacebookUser(facebookID);
};

// 🔹 Créer un utilisateur avec un Google ID
const createUserGoogle = async (googleID) => {
    return UsersModel.createGoogleUser(googleID);
};

// 🔹 Mettre à jour l'ID adhérant d’un utilisateur
const updateUserLicence = async (userId, adherantID) => {
    return UsersModel.updateAdherantId(userId, adherantID);
};

// 🔹 Fusionner les comptes Facebook et Google
const mergeUserFacebookAndGoogleIds = async (userId1, userId2) => {
    try {
        const user1 = await UsersModel.findUserById(userId1);
        const user2 = await UsersModel.findUserById(userId2);

        if (!user1 || !user2) {
            throw new Error("❌ Un ou les deux utilisateurs sont introuvables");
        }

        // 🔸 Si user1 a Google et user2 a Facebook → fusion
        if (user1.google_id && user2.facebook_id) {
            await UsersModel.updateFacebookId(userId1, user2.facebook_id);
            await UsersModel.deleteUserById(userId2);
            console.log(`✅ Fusion réussie : Google ID gardé, Facebook ID fusionné sous user ${userId1}`);
        }
        // 🔸 Si user1 a Facebook et user2 a Google → fusion
        else if (user1.facebook_id && user2.google_id) {
            await UsersModel.updateGoogleId(userId1, user2.google_id);
            await UsersModel.deleteUserById(userId2);
            console.log(`✅ Fusion réussie : Facebook ID gardé, Google ID fusionné sous user ${userId1}`);
        }
        else {
            throw new Error("❌ Fusion impossible : les comptes ne sont pas distincts (Google & Facebook)");
        }

        // Retourne l'utilisateur mis à jour après fusion
        return await UsersModel.findUserById(userId1);

    } catch (err) {
        console.error("❌ Erreur lors de la fusion des comptes :", err);
        throw err;
    }
};

// ✅ Exportation des fonctions
module.exports = {
    findUserByGoogleId,
    findUserByFacebookId,
    findUserByUserId,
    createUserFacebook,
    createUserGoogle,
    updateUserLicence,
    mergeUserFacebookAndGoogleIds
};