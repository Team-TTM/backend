
const xlsx = require('xlsx');
const AdherentsModel = require('../models/adherantModel');
const Adherent = require('../models/Adherent');
const {insertLicenceSaisonAssociation} = require('../models/licenceSaisonAssociationModel');
const {insertIfNotExists} = require('../models/saisonModel');
const {findUserByUserId} = require('./userService');



/**
 * Charge les données à partir d'un fichier Excel (XLSX).
 * @param {string} fichierXlsx - Le chemin vers le fichier Excel à charger.
 * @returns {Object[]} - Retourne les données sous forme de tableau d'objets JSON représentant les lignes du fichier.
 */
function chargerDonneesExcel(fichierXlsx) {
    const workbook = xlsx.readFile(fichierXlsx);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

/**
 * Récupère tous les adhérents de la base de données.
 * @returns {Promise<Object[Adherent]>} - Liste des adhérents.
 */
const getAllAdherents = async () => {
    try {
        console.log('📌 [SERVICE] Récupération de tous les adhérents...');
        const adherents = await AdherentsModel.getAllAdherents();
        const adherentList = [];
        adherents.map(adherent => {
            adherentList.push(Adherent.fromDataBase(adherent));
        });

        console.log(`✅ ${adherents.length} adhérents récupérés.`);
        return adherentList;
    } catch (error) {
        console.error('❌ [SERVICE] Erreur lors de la récupération des adhérents:', error);
        throw error;
    }
};


/**
 * Récupère tous les adhérents liés à un utilisateur donné.
 * @async
 * @function getAdherent
 * @param {string} userId - L'ID unique de l'utilisateur.
 * @returns {Promise<Adherent[]>} - Une promesse qui résout un tableau d'adhérents.
 * @throws {Error} - En cas d'échec de la récupération des adhérents.
 */
const getAdherent = async (userId) => {
    try {
        console.log(`📌 [SERVICE] Début de récupération des adhérents pour l'utilisateur ID: ${userId}...`);

        // Recherche de l'utilisateur
        const user = await findUserByUserId(userId);
        if (!user) {
            throw new Error(`Utilisateur introuvable pour l'ID: ${userId}`);
        }
        if (!user.numero_licence) {
            throw new Error(`Numéro de licence manquant pour l'utilisateur ID: ${userId}`);
        }

        console.log(`🔍 [SERVICE] Utilisateur trouvé: ${userId}, Licence: ${user.numero_licence}`);

        // Récupération des adhérents
        const adherentData = await AdherentsModel.getAdherentDetails(user.numero_licence);
        if (!adherentData || adherentData.length === 0) {
            console.warn(`⚠️ [SERVICE] Aucun adhérent trouvé pour l'utilisateur ${user.numero_licence}`);
            return [];
        }

        // Conversion en objets Adherent
        const adherents = Adherent.fromDataBase(adherentData);

        console.log(`✅ [SERVICE] ${adherents.length} adhérent(s) récupéré(s) pour l'utilisateur ${user.numero_licence}`);
        return adherents;
    } catch (error) {
        console.error(`❌ [SERVICE] Erreur lors de la récupération des adhérents pour l'utilisateur ID ${userId}: ${error.message}`);
        throw error;
    }
};

/**
 * Crée un nouvel adhérent dans la base de données via le modèle AdherentsModel.
 * @param {Adherent} adherent - L'objet Adherent à insérer dans la base de données.
 * @returns {Promise} - Une promesse qui se résout lorsque l'adhérent est créé.
 */
const createAdherent = async (adherent) => {
    await Promise.all([
        AdherentsModel.createAdherent(adherent),
        insertIfNotExists(adherent.getDerniereSaison())
    ]);
    await insertLicenceSaisonAssociation(adherent.getDerniereSaison(), adherent.numeroLicence);
};

/**
 * Met à jour un adhérent existant dans la base de données.
 * @param {Adherent} adherent - Les nouvelles données de l'adhérent à mettre à jour.
 * @returns {Promise} - Une promesse indiquant le succès ou l'échec de la mise à jour.
 */
const updateAdherent = async (adherent) => {
    const adherentData = await AdherentsModel.getAdherentDetails(adherent.numeroLicence);

    const adherentFromDb = Adherent.fromDataBase(adherentData);

    if (adherent.getDerniereSaison() > adherentFromDb.getDerniereSaison()) {
        adherent.merge(adherentFromDb);
        await insertIfNotExists(adherent.getDerniereSaison());
        await Promise.all([
            insertLicenceSaisonAssociation(adherent.getDerniereSaison(), adherent.numeroLicence),
            AdherentsModel.updateAdherent(adherent)
        ]);
    }
};

/**
 * Transforme les données provenant d'un fichier Excel en une liste d'objets Adherent.
 * @param {Object[]} donnees - Le tableau de données extrait du fichier Excel.
 * @returns {Promise<Adherent[]>} - Une promesse qui se résout avec un tableau d'objets Adherent.
 */
async function transformerDonneesEnAdherents(donnees) {
    const adherents = [];

    for (const row of donnees) {
        adherents.push(Adherent.fromCSV(row));
    }
    return adherents;
}

/**
 * Importe les données à partir d'un fichier Excel et les insère dans la base de données.
 * @param {string} fichierXlsx - Le chemin vers le fichier Excel à importer.
 * @returns {Promise} - Une promesse qui se résout après l'importation complète des données.
 */
async function importerXlsx(fichierXlsx) {
    try {
        console.log('📂 Chargement du fichier Excel...');
        const donnees = chargerDonneesExcel(fichierXlsx);
        console.log('🔄 Conversion des données..');
        const adherents = await transformerDonneesEnAdherents(donnees);
        console.log('🛠️ Importation des données dans la base de données...');

        let ajoutCount = 0;
        let majCount = 0;

        for (const adherent of adherents) {
            const exist = await checkAdherentLicence(adherent.numeroLicence);
            if (exist) {
                await updateAdherent(adherent);
                majCount++;
            } else {
                await createAdherent(adherent);
                ajoutCount++;
            }
        }

        console.log(`✅ Importation terminée avec succès. ${ajoutCount} documents ajoutés, ${majCount} documents mis à jour.`);
    } catch (err) {
        console.error('❌ Erreur lors de l\'importation :', err.message);
    }
}




/**
 * Vérifie si un adhérent existe en base de données.
 * @param {string} num_licence - Le numéro de licence de l'adhérent.
 * @returns {Promise<boolean>} - Retourne `true` si l'adhérent existe, sinon `false`.
 */
async function checkAdherentLicence(num_licence) {
    return AdherentsModel.adherentExist(num_licence);
}
module.exports = { importerXlsx, checkAdherentLicence, getAllAdherents ,getAdherent};
