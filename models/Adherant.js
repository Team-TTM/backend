const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const AdherantSchema = new Schema({
    statut: { type: String, required: true },
    nom: {
        prenom: { type: String, required: true },
        nom: { type: String, required: true },
        nomUsage: { type: String }
    },
    dateNaissance: { type: Date, required: true },
    sexe: { type: String, enum: ['M', 'F'], required: true },
    lieuNaissance: { type: String, required: true },
    profession: { type: String },
    nationalite: { type: String, required: true },
    adresse: {
        principale: { type: String, required: true },
        details: { type: String },
        lieuDit: { type: String },
        codePostal: { type: String, required: true },
        ville: { type: String, required: true },
        pays: { type: String, required: true }
    },
    contacts: {
        telephone: { type: String },
        mobile: { type: String },
        email: { type: String, required: true , match: [/^\S+@\S+\.\S+$/, 'Email invalide']},
        urgenceTelephone: { type: String }
    },
    accords: {
        fraisMutation: { type: Boolean, required: true },
        fraisFormation: { type: Boolean, required: true },
        droitImage: { type: Boolean, required: true },
        newsletterFederale: { type: Boolean, required: true },
        newsletterCommerciale: { type: Boolean, required: true },
        autorisationParentale: { type: Boolean, required: true }
    },
    licence: {
        numero : {type : String , required: true,unique : true},
        type: { type: String, required: true },
        longue: { type: Boolean, required: true },
        demiTarif: { type: Boolean, required: true },
        horsClub: { type: Boolean, required: true },
        clubId: { type: String ,required: true},
        dateValidation: { type: Date },
        dateDemande: { type: Date },
        categorieAge: { type: String, required: true },
        conditionsAssuranceValidees: { type: Boolean, required: true },
        typeCertificatMedical: { type: String, required: true },
        penaliteRetard: { type: Number, default: 0 },
        infosCloture: { type: String },
        anneeBlanche: { type: Boolean, required: true },
        premiereLicence: { type: Boolean, required: true }
    },
    paiements: {
        montantTotalPaye: { type: Number, required: true },
        parts: {
            federation: { type: Number, required: true },
            ligue: { type: Number, required: true },
            club: { type: Number, required: true }
        },
        assurance: {
            montant: { type: Number, required: true },
            details: { type: String, required: true }
        }
    },
    activites: {
        triathlon: { type: String, required: true },
        duathlon: { type: String, required: true },
        aquathlon: { type: String, required: true },
        bikeRun: { type: String, required: true },
        crossTriathlon: { type: String, required: true },
        crossDuathlon: { type: String, required: true },
        swimrun: { type: String, required: true },
        raids: { type: String, required: true },
        swimbike: { type: String, required: true }
    },
    categorieEducateur: { type: String }
});

const Adherant = mongoose.model('Adherant', AdherantSchema);
module.exports = Adherant;