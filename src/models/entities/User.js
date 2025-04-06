class User {
    constructor(id_user, numero_licence, role, charte_signe, google_id, facebook_id, newsletter) {
        this.userId = id_user;
        this.licenceId = numero_licence;
        this.role = role;
        this.chart = charte_signe;
        this._google_id = google_id;
        this._facebook_id = facebook_id;
        this.newsletter = newsletter;
    }



    get charte_signe() {
        return this.chart;
    }

    set charte_signe(value) {
        this.chart = value;
    }

    get google_id() {
        return this._google_id;
    }

    set google_id(value) {
        this._google_id = value;
    }

    get facebook_id() {
        return this._facebook_id;
    }

    set facebook_id(value) {
        this._facebook_id = value;
    }

    static createFacebookUser(facebookId) {
        return new User(null,
            null,
            'user',
            false,
            null,
            facebookId, false);
    }

    static createGoogleUser(googleId) {
        return new User(null,
            null,
            'user',
            false,
            googleId,
            null,
            false);
    }

    static createUserFromDataBase(userData) {
        return new User(userData.user_id,
            userData.licence_id,
            userData.role,
            userData.charte_signe,
            userData.google_id,
            userData.facebook_id,
            userData.newsletter);
    }
}

module.exports = User;