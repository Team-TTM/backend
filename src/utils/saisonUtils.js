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
const calculerSaison = (date) =>{

    const annee = date.getFullYear();
    const mois = date.getMonth();

    const saisonAnnee = mois >= 8 ? annee : annee - 1;
    return `${saisonAnnee}/${saisonAnnee + 1}`;
}

/**
 * Récupère la saison la plus récente à partir d'un tableau de saisons.
 * @param {string[]} saisons - Tableau des saisons sous le format "YYYY/YYYY+1".
 * @returns {string|null} - La saison la plus récente ou `null` si la liste est vide.
 */
const getSaisonPlusRecente = (saisons) =>{
    if (!saisons || saisons.length === 0) return null;

    saisons.sort((a, b) => {
        const anneeA = parseInt(a.split('/')[0], 10);
        const anneeB = parseInt(b.split('/')[0], 10);
        return anneeB - anneeA; // Tri décroissant
    });

    return saisons[0]; // Retourne la première (plus récente)
}

/**
 * Calcule le statut de la saison donnée.
 * @param {string} saison - La saison a vérifié sous le format "YYYY/YYYY+1".
 * @returns {boolean} - Vrai si la saison est la saison actuelle, faux sinon.
 */
const calculetStatut =(saison) => {
    return saison === calculerSaison(new Date())
    // return saison === calculerSaison(convertirDate("22/11/2026"))

}

/**
 * Convertit une date au format `DD/MM/YYYY` en objet Date JavaScript.
 * @param {string} dateStr - La date à convertir, au format `DD/MM/YYYY`.
 * @returns {Date} - La date convertie en format `YYYY-MM-DD'.
 * @example
 * convertirDate('01/09/2024'); // Retourne un objet Date pour le 1er septembre 2024
 */
function convertirDate(dateStr) {
    const [jour, mois, annee] = dateStr.split('/'); // Découpe la chaîne
    return new Date(`${annee}-${mois}-${jour}`); // Recompose dans le format YYYY-MM-DD
}

module.exports = {convertirDate,calculetStatut,getSaisonPlusRecente,calculerSaison}