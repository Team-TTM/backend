const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


const createToken = (userId) => {
    return jwt.sign(
        { userId: userId.toString() },
        process.env.JWT_SECRET,
        { expiresIn: '12h' }
    );
};

module.exports = {createToken};
