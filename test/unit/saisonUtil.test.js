const { expect } = require('chai');
const {getSaisonPlusRecente, calculerSaison, calculetStatut, convertirDate} = require('../../src/utils/saisonUtils');

describe('calculerSaison', () => {
    it('should return the correct season for a date in September', () => {
        const result = calculerSaison(new Date('2024-09-01'));
        expect(result).to.equal('2024/2025');
    });

    it('should return the correct season for a date in August', () => {
        const result = calculerSaison(new Date('2025-08-30'));
        expect(result).to.equal('2024/2025');
    });

    it('should throw an error for an invalid date', () => {
        expect(() => calculerSaison(new Date('invalid-date'))).to.throw(Error);
    });
});

/*
describe('getSaisonPlusRecente', () => {
    it('should return the most recent season from a list', () => {
        const result = getSaisonPlusRecente(['2023/2024', '2024/2025', '2022/2023']);
        expect(result).to.equal('2024/2025');
    });

    it('should return the input if it is not an array', () => {
        const result = getSaisonPlusRecente('2024/2025');
        expect(result).to.equal('2024/2025');
    });

    it('should return null for an empty array', () => {
        const result = getSaisonPlusRecente([]);
        expect(result).to.be.null;
    });
});

describe('calculetStatut', () => {
    it('should return true for the current season', () => {
        const currentSeason = calculerSaison(new Date());
        const result = calculetStatut(currentSeason);
        expect(result).to.be.true;
    });

    it('should return false for a past season', () => {
        const result = calculetStatut('2020/2021');
        expect(result).to.be.false;
    });
});

describe('convertirDate', () => {
    it('should convert a date string to a Date object', () => {
        const result = convertirDate('01/09/2024');
        expect(result).to.be.an.instanceof(Date);
        expect(result.getFullYear()).to.equal(2024);
        expect(result.getMonth()).to.equal(8); // September is month 8 in JavaScript Date
        expect(result.getDate()).to.equal(1);
    });

    it('should throw an error for an invalid date string', () => {
        expect(() => convertirDate('invalid-date')).to.throw(Error);
    });
});*/
