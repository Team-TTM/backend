const client = require('../config/database'); // Connexion à la base de données

// 🔹 Création de la table users
const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id_user SERIAL PRIMARY KEY,
            id_adherant INTEGER UNIQUE,
            role VARCHAR(255) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'dirigent')),
            charte_signe BOOLEAN NOT NULL DEFAULT FALSE,
            google_id VARCHAR(255) UNIQUE,
            facebook_id VARCHAR(255) UNIQUE,
            newsletter BOOLEAN NOT NULL DEFAULT FALSE,
            FOREIGN KEY (id_adherant) REFERENCES adherants(id_adherant) ON DELETE CASCADE
        );
    `;
    try {
        await client.query(query);
        console.log('✅ Table "users" créée ou déjà existante.');
    } catch (err) {
        console.error('❌ Erreur lors de la création de la table "users":', err);
        throw err;
    }
};

// 🔹 Insérer un utilisateur avec un Facebook ID
const createFacebookUser = async (facebookId) => {
    const query = `
        INSERT INTO users (facebook_id)
        VALUES ($1)
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [facebookId]);
        console.log('✅ Utilisateur Facebook inséré :', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Facebook:', err);
        throw err;
    }
};

// 🔹 Insérer un utilisateur avec un Google ID
const createGoogleUser = async (googleId) => {
    const query = `
        INSERT INTO users (google_id)
        VALUES ($1)
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [googleId]);
        console.log('✅ Utilisateur Google inséré :', res.rows[0]);
        return res.rows[0];
    } catch (err) {
        console.error('❌ Erreur lors de l’insertion de l’utilisateur Google:', err);
        throw err;
    }
};

// 🔹 Trouver un utilisateur via son Facebook ID
const findUserByFacebookId = async (facebookId) => {
    const query = `
        SELECT * FROM users
        WHERE facebook_id = $1;
    `;
    try {
        const res = await client.query(query, [facebookId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Facebook:', err);
        throw err;
    }
};

// 🔹 Trouver un utilisateur via son Google ID
const findUserByGoogleId = async (googleId) => {
    const query = `
        SELECT * FROM users
        WHERE google_id = $1;
    `;
    try {
        const res = await client.query(query, [googleId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la recherche de l’utilisateur Google:', err);
        throw err;
    }
};

// 🔹 Trouver un utilisateur via son ID utilisateur
const findUserById = async (userId) => {
    const query = `
        SELECT * FROM users
        WHERE id_user = $1;
    `;
    try {
        const res = await client.query(query, [userId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la récupération de l’utilisateur:', err);
        throw err;
    }
};

// 🔹 Mettre à jour le Facebook ID d’un utilisateur
const updateFacebookId = async (userId, facebookId) => {
    const query = `
        UPDATE users
        SET facebook_id = $2
        WHERE id_user = $1
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [userId, facebookId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Facebook ID:', err);
        throw err;
    }
};

// 🔹 Mettre à jour le Google ID d’un utilisateur
const updateGoogleId = async (userId, googleId) => {
    const query = `
        UPDATE users
        SET google_id = $2
        WHERE id_user = $1
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [userId, googleId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour du Google ID:', err);
        throw err;
    }
};

// 🔹 Mettre à jour l’ID adhérant d’un utilisateur
const updateAdherantId = async (userId, adherantId) => {
    const query = `
        UPDATE users
        SET id_adherant = $2
        WHERE id_user = $1
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [userId, adherantId]); // Correction du mauvais paramètre
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la mise à jour de l’ID adhérant:', err);
        throw err;
    }
};

// 🔹 Supprimer un utilisateur par ID
const deleteUserById = async (userId) => {
    const query = `
        DELETE FROM users
        WHERE id_user = $1
        RETURNING *;
    `;
    try {
        const res = await client.query(query, [userId]);
        return res.rows[0] || null;
    } catch (err) {
        console.error('❌ Erreur lors de la suppression de l’utilisateur:', err);
        throw err;
    }
};

// ✅ Exportation des fonctions
module.exports = {
    createUserTable,
    createFacebookUser,
    createGoogleUser,
    findUserByFacebookId,
    findUserByGoogleId,
    findUserById,
    updateFacebookId,
    updateGoogleId,
    updateAdherantId,
    deleteUserById,
};