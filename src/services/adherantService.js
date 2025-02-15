const xlsx = require('xlsx');
const AdherantsModel = require('../models/adherantModel');


function convertirDate(dateStr) {
    const [jour, mois, annee] = dateStr.split('/'); // Découpe la chaîne
    return new Date(`${annee}-${mois}-${jour}`); // Recompose dans le format YYYY-MM-DD
}

function chargerDonneesExcel(fichierXlsx) {
    const workbook = xlsx.readFile(fichierXlsx);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}
// Fonction pour insérer les adhérents dans MongoDB


const createAdherant = async (adherantData) => {
    return await AdherantsModel.createAdherant(adherantData)
}


// TODO
const updateAdherant = async (adherantData) => {
    return null;
}

async function transformerDonneesEnAdherants(donnees) {
    const adherants = [];

    for (const row of donnees) {
            adherants.push({
                statut: row['Statut'] === 'Validé' || null,
                nom: {
                    prenom: row['Prénom'] || null,
                    nom: row['Nom'] || null,
                    nomUsage: null,
                //     TODO
                },
                dateNaissance: convertirDate(row['Date de naissance']) || null,
                sexe: row['Sexe'] ? row['Sexe'].toUpperCase() : null,
                lieuNaissance: row['Lieu de naissance'] || null,
                profession: row['Profession'] || null,
                nationalite: row['Nationalité'] || null,
                adresse: {
                    principale: row['Adresse principale'] || null,
                    details: row['Adresse Détails'] || null,
                    lieuDit: null,
                    codePostal: row['Code Postal'] || null,
                    ville: row['Ville'] || null,
                    pays: row['Pays'] || null,
                },
                contacts: {
                    telephone: row['Téléphone'] || null,
                    mobile: null,
                    email: row['Email'] || null,
                    urgenceTelephone: row['Téléphone contact d\'urgence'] || null,
                },
                accords: {
                    fraisMutation: row['Accord frais de mutation'] === 'Oui',
                    fraisFormation: row['Accord frais de formation'] === 'Oui',
                    droitImage: row['Cession du droit à l\'image'] === 'Oui',
                newsletterFederale: row['Newsletter fédérale'] === 'Oui',
                newsletterCommerciale: row['Newsletter commerciale'] === 'Oui',
                autorisationParentale: row['Autorisation parentale pour les mineurs'] === 'Oui',
            },
            licence: {
                numero :  row['Numéro de licence'],
                type: row['Type de licence'],
                longue: row['Licence longue'] === 'Oui',
                demiTarif: row['Licence demi-tarif'] === 'Oui',
                horsClub: row['Licence hors club (licence individuelle)'] === 'Oui',
                clubId: row['Club ID'] || null,
                dateValidation: convertirDate(row['Date validation de la licence']) || null,
                dateDemande: convertirDate(row['Date demande licence']) || null,
                categorieAge: row['Catégorie d\'âge'] || null,
                conditionsAssuranceValidees: row['A validé les conditions d\'assurance'] === 'Oui',
                typeCertificatMedical: row['Type de certificat médical'] || null,
                penaliteRetard: row['Pénalité de retard'] === 'Oui' ? 1 : 0,
                infosCloture: null,
                anneeBlanche: row['Année blanche'] === 'Oui',
                premiereLicence: row['Première licence'] === 'Oui',
            },
            paiements: {
                montantTotalPaye: row['Montant total payé en ligne'] === 'Oui' ? 1 : 0,
                parts: {
                    federation: Number(row['Montant part Fédérale']?.replace(',', '.')) || 0,
                    ligue: Number(row['Montant part Ligue']?.replace(',', '.')) || 0,
                    club: row['Montant part Club'] === '-' ? 0 : Number(row['Montant part Club']?.replace(',', '.')) || 0,
                },
                assurance: {
                    montant: Number(row['Montant Assurance']?.replace(',', '.')) || 0,
                    details: row['Assurance'] || null,
                },
            },
            activites: {
                triathlon: row['Triathlon'],
                duathlon: row['Duathlon'],
                aquathlon: row['Aquathlon'],
                bikeRun: row['Bike & Run'],
                crossTriathlon: row['Cross Triathlon'],
                crossDuathlon: row['Cross Duathlon'],
                swimrun: row['Swimrun'],
                raids: row['Raids'],
                swimbike: row['Swimbike'],
            },
            categorieEducateur: null,
        });
    }
    return adherants;
}

const createOrUpdateAdherant = async (adherant) => {
    const exist = await checkAdherantLicence(adherant.licence.numero)
    if (exist) {
        await updateAdherant(adherant);
    } else {
        await createAdherant(adherant)
    }
}

async function insererAdherants(adherants) {
    try {
        await adherants.forEach((adherant) => createOrUpdateAdherant(adherant));
    } catch (err) {
        console.error('❌ Erreur lors de l\'importation :', err.message);
    }
}

async function importerXlsx(fichierXlsx) {
    try {
        console.log('📂 Chargement du fichier Excel...');
        const donnees = chargerDonneesExcel(fichierXlsx);
        console.log('🔄 Conversion des données..');
        const adherents = await transformerDonneesEnAdherants(donnees);
        console.log('🛠️ Importation des données dans la base de donner...');
        await insererAdherants(adherents);
        console.log(`✅ Importation terminée avec succès. ${adherents.length} documents insérés.`);
    } catch (err) {
        console.error('❌ Erreur lors de l\'importation :', err.message);
    }
}


/**
 * Vérifie si un adhérent existe en base de données.
 * @param {string} num_licence - Le numéro de licence de l'adhérent.
 * @returns {Promise<boolean>} - Retourne `true` si l'adhérent existe, sinon `false`.
 */
async function checkAdherantLicence(num_licence) {
    return AdherantsModel.adherantExist(num_licence)
}
module.exports = {importerXlsx, checkAdherantLicence};