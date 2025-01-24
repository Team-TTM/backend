const User = require("../models/Users");

const findUserByGoogleID = async (googleId) => {
    return User.findOne({googleId});
};

const findUserByFacebookID = async (facebookID) => {
    return User.findOne(facebookID);
};

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};


const checkLicence = async (user) => {
    return User.exists({ licence: { $exists: true } });
};
module.exports = {findUserByGoogleID, findUserByFacebookID, createUser , checkLicence};