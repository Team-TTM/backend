const { calculerSaison, getSaisonPlusRecente, calculetStatut, convertirDate } = require('../../src/models/Adherent');

describe('Tests des fonctions', () => {

    // Test de la fonction calculerSaison
    test('calculerSaison retourne la saison correcte', () => {
        const date = new Date('2024-09-01'); // Date en septembre 2024
        const saison = calculerSaison(date);
        expect(saison).toBe('2024/2025');
    });

    test('calculerSaison retourne la saison correcte pour une date avant septembre', () => {
        const date = new Date('2024-01-01'); // Date en janvier 2024
        const saison = calculerSaison(date);
        expect(saison).toBe('2023/2024');
    });

    // Test de la fonction getSaisonPlusRecente
    test('getSaisonPlusRecente retourne la saison la plus récente', () => {
        const saisons = ['2023/2024', '2024/2025'];
        const saisonRecente = getSaisonPlusRecente(saisons);
        expect(saisonRecente).toBe('2024/2025');
    });

    test('getSaisonPlusRecente retourne null si le tableau est vide', () => {
        const saisons = [];
        const saisonRecente = getSaisonPlusRecente(saisons);
        expect(saisonRecente).toBeNull();
    });

    // Test de la fonction calculetStatut
    test('calculetStatut retourne true pour la saison actuelle', () => {
        const saisonActuelle = calculerSaison(new Date()); // Calcul de la saison actuelle
        const statut = calculetStatut(saisonActuelle);
        expect(statut).toBe(true);
    });

    test('calculetStatut retourne false pour une autre saison', () => {
        const saisonFuture = '2025/2026'; // Saison future
        const statut = calculetStatut(saisonFuture);
        expect(statut).toBe(false);
    });

    // Test de la fonction convertirDate
    test('convertirDate convertit correctement une date au format DD/MM/YYYY', () => {
        const dateStr = '01/09/2024';
        const dateObj = convertirDate(dateStr);
        expect(dateObj).toEqual(new Date('2024-09-01')); // Vérifie si les dates sont égales
    });

    test('convertirDate gère les mauvaises dates', () => {
        const dateStr = '32/13/2024'; // Date invalide
        const dateObj = convertirDate(dateStr);
        expect(dateObj).toEqual(new Date('2024-13-32')); // La date sera mal formée (Invalid Date)
    });

});