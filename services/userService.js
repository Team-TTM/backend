const User = require("../models/Users");

const findUserByGoogleID = async (googleId) => {
    return User.findOne({googleId});
};

const createUser = async (userData) => {
    const user = new User(userData);
    await user.save();
    return user;
};

module.exports = { findUserByGoogleID, createUser };