const {fromRequestData} = require('../models/entities/UserCredential');

const validateUserCredentialData = (req, res, next) => {
    try {
        const data = req.body;
        if (!data) {
            return res.status(400).json({message: 'Le body est vide'});
        }
        req.userCredential = fromRequestData(data);
        next();
    } catch (err) {
        console.error(err.message);
        return res.status(400).json({error: err.message});
    }
};

module.exports = validateUserCredentialData;