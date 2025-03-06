import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const pool = require('../../config/database');
const usersModel = require('../../src/models/usersModel');


describe('Users Model', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('createUserTable', () => {
        it('should create the users table', async () => {
            const executeStub = sinon.stub(pool, 'execute').resolves();
            await usersModel.createUserTable();
            expect(executeStub.calledOnce).to.be.true;
        });
    });

    describe('createFacebookUser', () => {
        it('should insert a Facebook user and return the user ID', async () => {
            const user = { facebook_id: 'fb123' };
            const rows = [{ insertId: 1 }];
            const executeStub = sinon.stub(pool, 'execute').resolves([rows]);

            const userId = await usersModel.createFacebookUser(user);

            expect(executeStub.calledOnce).to.be.true;
            expect(userId).to.equal(1);
        });

        it('should throw an error when the insertion fails', async () => {
            const user = { facebook_id: 'fb123' };
            const executeStub = sinon.stub(pool, 'execute').rejects(new Error('Database error'));

            try {
                await usersModel.createFacebookUser(user);
            } catch (err) {
                expect(executeStub.calledOnce).to.be.true;
                expect(err.message).to.equal('Database error');
            }
        });
    });

    describe('createGoogleUser', () => {
        it('should insert a Google user and return the user ID', async () => {
            const user = { google_id: 'google123' };
            const rows = [{ id_user: 1 }];
            const executeStub = sinon.stub(pool, 'execute').resolves([rows]);
            const userId = await usersModel.createGoogleUser(user);
            expect(executeStub.calledOnce).to.be.true;
            expect(userId).to.equal(1);
        });
    });

    describe('findUserByFacebookId', () => {
        it('should find a user by Facebook ID', async () => {
            const facebookId = 'fb123';
            const rows = [{ id_user: 1, facebook_id: facebookId }];
            const executeStub = sinon.stub(pool, 'execute').resolves([rows]);
            const user = await usersModel.findUserByFacebookId(facebookId);
            expect(executeStub.calledOnce).to.be.true;
            expect(user).to.deep.equal(rows[0]);
        });
    });

    describe('findUserByGoogleId', () => {
        it('should find a user by Google ID', async () => {
            const googleId = 'google123';
            const rows = [{ id_user: 1, google_id: googleId }];
            const executeStub = sinon.stub(pool, 'execute').resolves([rows]);
            const user = await usersModel.findUserByGoogleId(googleId);
            expect(executeStub.calledOnce).to.be.true;
            expect(user).to.deep.equal(rows[0]);
        });
    });

    // Ajoutez d'autres tests pour les autres fonctions du modèle
});