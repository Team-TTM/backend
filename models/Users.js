const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    numero_licence: {
        type: String,
        unique: true,
    },
    role: {
        type : String,
        required: true,
        default: 'user',

    },
    charte_signe:{
        type : String,
        required: true,
        default: false,
    },
    googleId: {
        type:String,
        unique: true,
    },
    facebookId:{
        type:String,
        unique: true,

    }
});


// Créer le modèle à partir du schéma

const User = mongoose.model('User', userSchema);

module.exports = User;