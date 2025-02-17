/**
 * Calcule la saison à laquelle appartient une date donnée.
 * La saison commence en septembre et se termine en août de l'année suivante.
 * Par exemple, pour une date comprise entre septembre 2024 et août 2025, la saison sera "2024/2025".
 *
 * @param {Date} date - La date à partir de laquelle la saison doit être calculée. Cela peut être une chaîne de caractères au format "YYYY-MM-DD" ou un objet `Date'.
 * @returns {string} La saison au format "YYYY/YYYY", où la première année est l'année de début de la saison et la deuxième année est l'année de fin.
 * @throws {Error} Si la date fournie est invalide, une erreur est lancée.
 *
 * @example
 * console.log(calculerSaison('2024-09-01'));  // Saison 2024/2025
 * console.log(calculerSaison('2025-03-01'));  // Saison 2024/2025
 * console.log(calculerSaison('2025-07-15'));  // Saison 2024/2025
 * console.log(calculerSaison('2025-08-30'));  // Saison 2024/2025
 * console.log(calculerSaison('2025-09-01'));  // Saison 2025/2026
 */
function calculerSaison(date) {

    // Récupère l'année et le mois
    const annee = date.getFullYear();
    const mois = date.getMonth(); // 0 = janvier, 1 = Février, ..., 8 = Septembre, ...

    // Si le mois est avant septembre (c'est-à-dire Janvier - Août), la saison est l'année précédente
    const saisonAnnee = mois >= 8 ? annee : annee - 1;

    // Retourne la saison sous le format "2024/2025"
    return `${saisonAnnee}/${saisonAnnee + 1}`;
}


/**
 * Calcule le statut de la saison donnée.
 * @param {string} saison - La saison à vérifier sous le format "YYYY/YYYY+1".
 * @returns {boolean} - Vrai si la saison est la saison actuelle, faux sinon.
 */
function calculetStatut(saison) {
    return saison === calculerSaison(new Date())

}

/**
 * Convertit une date au format `DD/MM/YYYY` en objet Date JavaScript.
 * @param {string} dateStr - La date à convertir, au format `DD/MM/YYYY`.
 * @returns {Date} - La date convertie en format `YYYY-MM-DD`.
 * @example
 * convertirDate('01/09/2024'); // Retourne un objet Date pour le 1er septembre 2024
 */
function convertirDate(dateStr) {
    const [jour, mois, annee] = dateStr.split('/'); // Découpe la chaîne
    return new Date(`${annee}-${mois}-${jour}`); // Recompose dans le format YYYY-MM-DD
}


class Adherant {
    get numeroLicence() {
        return this._numeroLicence;
    }

    get statut() {
        return this._statut;
    }

    get type() {
        return this._type;
    }

    get longue() {
        return this._longue;
    }

    get demiTarif() {
        return this._demiTarif;
    }

    get horsClub() {
        return this._horsClub;
    }

    get categorie() {
        return this._categorie;
    }

    get anneeBlanche() {
        return this._anneeBlanche;
    }

    get pratique() {
        return this._pratique;
    }

    get prenom() {
        return this._prenom;
    }

    get nom() {
        return this._nom;
    }

    get nomUsage() {
        return this._nomUsage;
    }

    get dateNaissance() {
        return this._dateNaissance;
    }

    get sexe() {
        return this._sexe;
    }

    get profession() {
        return this._profession;
    }

    get principale() {
        return this._principale;
    }

    get details() {
        return this._details;
    }

    get lieuDit() {
        return this._lieuDit;
    }

    get codePostal() {
        return this._codePostal;
    }

    get ville() {
        return this._ville;
    }

    get pays() {
        return this._pays;
    }

    get telephone() {
        return this._telephone;
    }

    get mobile() {
        return this._mobile;
    }

    get email() {
        return this._email;
    }

    get urgenceTelephone() {
        return this._urgenceTelephone;
    }
    /**
     * Constructeur de la classe Adherant.
     * @param {string} numeroLicence - Le numéro de licence de l'adhérent.
     * @param {boolean} statut - Le statut de l'adhérent (par exemple, validé).
     * @param {string} type - Le type de licence.
     * @param {boolean} longue - Si la licence est longue.
     * @param {boolean} demiTarif - Si l'adhérent bénéficie d'un tarif réduit.
     * @param {boolean} horsClub - Si l'adhérent est hors club.
     * @param {string} categorie - La catégorie de l'adhérent.
     * @param {boolean} anneeBlanche - Si l'adhérent a une année blanche.
     * @param {string} pratique - La pratique de l'adhérent (par exemple, triathlon).
     * @param {string} prenom - Le prénom de l'adhérent.
     * @param {string} nom - Le nom de l'adhérent.
     * @param {string} nomUsage - Le nom d'usage de l'adhérent.
     * @param {Date} dateNaissance - La date de naissance de l'adhérent (format "YYYY-MM-DD").
     * @param {string} sexe - Le sexe de l'adhérent.
     * @param {string} profession - La profession de l'adhérent.
     * @param {string} principale - L'adresse principale de l'adhérent.
     * @param {string} details - Les détails de l'adresse.
     * @param {string} lieuDit - Le lieu-dit de l'adresse.
     * @param {string} codePostal - Le code postal de l'adhérent.
     * @param {string} ville - La ville de l'adhérent.
     * @param {string} pays - Le pays de l'adhérent.
     * @param {string} telephone - Le numéro de téléphone de l'adhérent.
     * @param {string} mobile - Le numéro de téléphone mobile de l'adhérent.
     * @param {string} email - L'email de l'adhérent.
     * @param {string} urgenceTelephone - Le numéro de téléphone d'urgence de l'adhérent.
     * @param {array} saison - La saison à laquelle l'adhérent appartient (ex: ["2024/2025"]).
     */
    constructor(
        numeroLicence,
        statut,
        type ,
        longue ,
        demiTarif ,
        horsClub ,
        categorie ,
        anneeBlanche ,
        pratique ,
        prenom ,
        nom ,
        nomUsage ,
        dateNaissance ,
        sexe ,
        profession ,
        principale ,
        details ,
        lieuDit ,
        codePostal,
        ville ,
        pays ,
        telephone,
        mobile ,
        email ,
        urgenceTelephone,
        saison = []
    ) {
        this._saison = saison;
        this._numeroLicence = numeroLicence;
        this._statut = statut;
        this._type = type;
        this._longue = longue;
        this._demiTarif = demiTarif;
        this._horsClub = horsClub;
        this._categorie = categorie;
        this._anneeBlanche = anneeBlanche;
        this._pratique = pratique;
        this._prenom = prenom;
        this._nom = nom;
        this._nomUsage = nomUsage;
        this._dateNaissance = dateNaissance;
        this._sexe = sexe;
        this._profession = profession;
        this._principale = principale;
        this._details = details;
        this._lieuDit = lieuDit;
        this._codePostal = codePostal;
        this._ville = ville;
        this._pays = pays;
        this._telephone = telephone;
        this._mobile = mobile;
        this._email = email;
        this._urgenceTelephone = urgenceTelephone;

    }


    set saison(value) {
        this._saison = value;
    }

    /**
     * Getter pour obtenir la saison.
     * @returns {string} La saison au format "YYYY/YYYY".
     */
    get saison() {
        return this._saison || null;
    }



    /**
     * Crée un objet Adherant à partir d'une ligne de fichier CSV ou d'une source brute.
     * @param {Object} row - Ligne de données source (ex: fichier CSV).
     * @returns {Adherant} Une instance de Adherant.
     */
    static fromCSV(row) {
        // Utilisation de la fonction calculerSaison pour obtenir la saison
        const saison = calculerSaison(convertirDate(row['Date validation de la licence']));
        const dateNaisance =  convertirDate(row['Date de naissance'])

        return new Adherant(
            row['Numéro de licence'],
            calculetStatut(saison),
            row['Type de licence'],
            row['Licence longue'] === 'Oui',
            row['Licence demi-tarif'] === 'Oui',
            row['Licence hors club (licence individuelle)'] === 'Oui',
            row['Catégorie d\'âge'],
            row['Année blanche'] === 'Oui',
            row['Triathlon'],
            row['Prénom'],
            row['Nom'],
            row['Nom Usage'],
            dateNaisance,
            row['Sexe'] ? row['Sexe'].toUpperCase() : null,
            row['Profession'],
            row['Adresse principale'],
            row['Adresse Détails'],
            row['Lieu dit'],
            row['Code Postal'],
            row['Ville'],
            row['Pays'],
            row['Téléphone'],
            row['Mobile'],
            row['Email'],
            row['Téléphone contact d\'urgence'],
            [saison]  // Saison calculée et ajoutée
        );
    }

    /**
     * Crée un adhérent à partir des données fournies.
     * @param {Object} adherentData - Données de l'adhérent sous forme d'objet.
     * @returns {Adherant} - Instance de la classe Adherant.
     */
    static fromDataBase(adherentData) {
        return new Adherant(
            adherentData.numero_licence,
            adherentData.statut || false,
            adherentData.type || null,
            false, // Pas de donnée pour 'longue', on met false par défaut
            adherentData.demi_tarif || false,
            adherentData.hors_club || false,
            adherentData.categorie || null,
            adherentData.annee_blanche || false,
            adherentData.pratique || null,
            adherentData.prenom || null,
            adherentData.nom || null,
            adherentData.nom_usage || null,
            new Date(adherentData.date_naissance) || null, // Conversion en Date
            adherentData.sexe || null,
            adherentData.profession || null,
            adherentData.principale || null,
            adherentData.details || null,
            adherentData.lieu_dit || null,
            adherentData.code_postale || null,
            adherentData.ville || null,
            adherentData.pays || null,
            adherentData.telephone || null,
            adherentData.mobile || null,
            adherentData.email || null,
            adherentData.urgency_telephone || null,
            adherentData.saisons || null,
        );
    }
}

module.exports = Adherant;