const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const { expect } = chai;
const app = require('../../server'); // Assurez-vous que votre application Express est exportée dans app.js
const passport = require('passport');
const authController = require('../../src/controllers/authController');

chai.use(chaiHttp);

    afterEach(() => {
        sinon.restore();
    });

    describe('GET /auth/google', () => {
        it('should redirect to Google authentication', (done) => {
            chai.request(app)
                .get('/auth/google')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /auth/google/callback', () => {
        it('should handle Google authentication callback', (done) => {
            sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
                return (req, res, next) => {
                    callback(req, res, next);
                };
            });
            sinon.stub(authController, 'googleAuthController').callsFake((req, res) => {
                res.status(200).send('Google Auth Callback');
            });

            chai.request(app)
                .get('/auth/google/callback')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Google Auth Callback');
                    done();
                });
        });
    });

    describe('GET /auth/facebook', () => {
        it('should redirect to Facebook authentication', (done) => {
            chai.request(app)
                .get('/auth/facebook')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    done();
                });
        });
    });

    describe('GET /auth/facebook/callback', () => {
        it('should handle Facebook authentication callback', (done) => {
            sinon.stub(passport, 'authenticate').callsFake((strategy, options, callback) => {
                return (req, res, next) => {
                    callback(req, res, next);
                };
            });
            sinon.stub(authController, 'facebookAuthController').callsFake((req, res) => {
                res.status(200).send('Facebook Auth Callback');
            });

            chai.request(app)
                .get('/auth/facebook/callback')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Facebook Auth Callback');
                    done();
                });
        });
    });

    describe('POST /licence-check', () => {
        it('should check licence and return 200 if valid', (done) => {
            sinon.stub(authController, 'licenceSignInController').callsFake((req, res) => {
                res.status(200).send('Licence Valid');
            });

            chai.request(app)
                .post('/licence-check')
                .set('Authorization', 'Bearer valid-token')
                .send({ licence: 'valid-licence' })
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.text).to.equal('Licence Valid');
                    done();
                });
        });
    });

    describe('GET *', () => {
        it('should return index.html for any other route', (done) => {
            chai.request(app)
                .get('/random-route')
                .end((err, res) => {
                    expect(res).to.have.status(200);
                    expect(res).to.be.html;
                    done();
                });
        });
    });
});