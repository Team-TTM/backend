const jwt = require('jsonwebtoken');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        console.log("token = ", token
        )
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decode token ", decodedToken)
        const userId = decodedToken.userId;
        console.log("middlaware = ", userId
            )
        req.auth = {
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};