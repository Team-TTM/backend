const User = require("../models/Users");

// TODO pas sur que ca marhche

const findUserByGoogleId = async (googleId) => {
    return User.findOne({ googleId: googleId });
};

const findUserByFacebookId = async (facebookId) => {
    return User.findOne({ facebookId: facebookId });
};

const findUserByLicence = async (licence) => {
    return User.findOne({ licence: licence }, '_id');
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

const doesUserExistById = async (userId) => {
    return User.exists({ _id: userId });
};

const updateUserLicence = async (userId, licence) => {
    await User.updateOne(
        { _id: userId },
        { $set: { licence: licence } }
    );
};

async function getFacebookId(userId) {
    const user = await User.findOne({ _id: userId }, 'facebookId');
    return user ? user.facebookId : undefined;
}

async function getGoogleId(userId) {
    const user = await User.findOne({ _id: userId }, 'googleId');
    return user ? user.googleId : undefined;
}

const mergeUserFacebookAndGoogleIds = async (userId1, userId2) => {
    const user1 = await User.findOne({ _id: userId1 });
    const user2 = await User.findOne({ _id: userId2 });

    if (!user1 || !user2) {
        return;
    }

    // Si l'utilisateur 1 possède un ID Google et l'utilisateur 2 possède un ID Facebook
    if (user1.googleId && user2.facebookId) {
        await User.updateOne(
            { _id: userId1 },
            { $set: { facebookId: user2.facebookId } }
        );
    }

    // Si l'utilisateur 1 possède un ID Facebook et l'utilisateur 2 possède un ID Google
    if (user1.facebookId && user2.googleId) {
        await User.updateOne(
            { _id: userId1 },
            { $set: { googleId: user2.googleId } }
        );
    }
};

module.exports = {
    findUserByGoogleId,
    findUserByLicence,
    findUserByFacebookId,
    findUserByUserId,
    createUser,
    doesUserHaveLicence,
    doesUserExistById,
    updateUserLicence,
    mergeUserFacebookAndGoogleIds
};