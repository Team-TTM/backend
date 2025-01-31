const User = require("../models/Users");

const findUserByGoogleId = async (googleId) => {
    return User.findOne({ googleId });
};

const findUserByFacebookId = async (facebookId) => {
    return User.findOne({ facebookId });
};

const findUserByLicence = async (licence) => {
    return User.findOne({ licence });
};

const findUserByUserId = async (userId) => {
    return User.findOne({ _id: userId });
};

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

const doesUserHaveLicence = async (userId) => {
    return User.exists({ _id: userId, licence: { $exists: true } });
};

const userExistsById = async (userId) => {
    return User.exists({ _id: userId });
};

const updateUserLicence = async (userId, licence) => {
    await User.updateOne(
        { _id: userId },
        { $set: { licence } }
    );
};

const getFacebookId = async (userId) => {
    const user = await User.findOne({ _id: userId }, 'facebookId');
    return user ? user.facebookId : null;
};

const getGoogleId = async (userId) => {
    const user = await User.findOne({ _id: userId }, 'googleId');
    return user ? user.googleId : null;
};

const deleteUserById = async (userId) => {
    try {
        const user = await User.findByIdAndDelete(userId);
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }
        return user;
    } catch (error) {
        console.error('Erreur lors de la suppression :', error);
        throw error;
    }
};

const mergeUserFacebookAndGoogleIds = async (userId1, userId2) => {
    const user1 = await User.findOne({ _id: userId1 });
    const user2 = await User.findOne({ _id: userId2 });

    if (!user1 || !user2) {
        throw new Error("Un ou les deux utilisateurs sont introuvables");
    }

    // Si l'utilisateur 1 possède un ID Google et l'utilisateur 2 possède un ID Facebook
    if (user1.googleId && user2.facebookId) {
        await User.updateOne(
            { _id: userId1 },
            { $set: { facebookId: user2.facebookId } }
        );
    }
    // Si l'utilisateur 1 possède un ID Facebook et l'utilisateur 2 possède un ID Google
    else if (user1.facebookId && user2.googleId) {
        await User.updateOne(
            { _id: userId1 },
            { $set: { googleId: user2.googleId } }
        );
    } else {
        throw new Error("Fusion impossible, les utilisateurs ne possèdent pas des comptes différents (Google et Facebook)");
    }

    await deleteUserById(userId2);  // Suppression de l'utilisateur 2 après fusion
};

module.exports = {
    findUserByGoogleId,
    findUserByFacebookId,
    findUserByLicence,
    findUserByUserId,
    createUser,
    doesUserHaveLicence,
    userExistsById,
    updateUserLicence,
    getFacebookId,
    getGoogleId,
    deleteUserById,
    mergeUserFacebookAndGoogleIds
};