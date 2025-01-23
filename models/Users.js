const mongoose = require('mongoose');

const conexionSchema = new mongoose.Schema({
    googleId: {
        type:String,
        required: false,
        unique: true,
    },
    facebookId:{
        type:String,
        required: false,
        unique: true,
    }

});

// Définir le schéma pour les utilisateurs
const userSchema = new mongoose.Schema({
    id_licence: {
        type: String,
        required: true,
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
    conexion: conexionSchema,


});


// Créer le modèle à partir du schéma
const User = mongoose.model('User', userSchema);

module.exports = User;