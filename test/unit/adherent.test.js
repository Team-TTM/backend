import {formaterNumeroTelephone} from '../../src/models/entities/Adherent';

describe('Tests de formatage des numéros de téléphone', () => {
    test('Format classique 0X XXXXXXXX', () => {
        expect(formaterNumeroTelephone('0665176886')).toBe('0665176886');
    });

    test('Format international 0033X XXXXXXXX', () => {
        expect(formaterNumeroTelephone('0033688210411')).toBe('068210411');
    });

    test('Format avec espaces 06 33 36 60 03', () => {
        expect(formaterNumeroTelephone('06 33 36 60 03')).toBe('0633366003');
    });

    test('Format sans indicatif 678861331', () => {
        expect(formaterNumeroTelephone('678861331')).toBe('0678861331');
    });

    test('Format avec espaces et début de numéro  06 74 75 19 97', () => {
        expect(formaterNumeroTelephone(' 06 74 75 19 97')).toBe('0674751997');
    });

    test('Format international +33 6 75 70 62 51', () => {
        expect(formaterNumeroTelephone('+33 6 75 70 62 51')).toBe('0675706251');
    });

    test('Format avec tirets 7-67-90-57-97', () => {
        expect(formaterNumeroTelephone('7-67-90-57-97')).toBe('0767905797');
    });

    test('Format international 33X XXXXXXXX', () => {
        expect(formaterNumeroTelephone('33686148199')).toBe('0686148199');
    });

    test('Numéro invalide', () => {
        expect(formaterNumeroTelephone('abc')).toBeNull();
    });
});