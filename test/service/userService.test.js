const chai = require('chai');
const sinon = require('sinon');
const { expect } = chai;
const UsersModel = require('../../src/models/usersModel');
const UserService = require('../../src/services/userService');
const User = require('../../src/models/User');

// TODO
describe('User Service', () => {
    afterEach(() => {
        sinon.restore();
    });

    describe('findUserByGoogleId', () => {
        it('should return a user when found by Google ID', async () => {
            const googleId = 'google123';
            const userData = { id_user: 1, google_id: googleId };
            sinon.stub(UsersModel, 'findUserByGoogleId').resolves(userData);
            sinon.stub(User, 'createUserFromDataBase').returns(userData);

            const user = await UserService.findUserByGoogleId(googleId);
            expect(user).to.deep.equal(userData);
        });

        it('should return null when no user is found by Google ID', async () => {
            const googleId = 'google123';
            sinon.stub(UsersModel, 'findUserByGoogleId').resolves(null);

            const user = await UserService.findUserByGoogleId(googleId);
            expect(user).to.be.null;
        });
    });

    describe('createUserFacebook', () => {
        it('should create a Facebook user and return the user', async () => {
            const facebookID = 'fb123';
            const user = { facebook_id: facebookID, id_user: 1 };
            sinon.stub(User, 'createFacebookUser').returns(user);
            sinon.stub(UsersModel, 'createFacebookUser').resolves(1);

            const createdUser = await UserService.createUserFacebook(facebookID);
            expect(createdUser).to.deep.equal(user);
        });
    });

    // Ajoutez d'autres tests pour les autres fonctions du service
});