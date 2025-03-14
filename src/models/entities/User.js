class User {
    constructor(id_user, numero_licence, role, charte_signe, google_id, facebook_id, newsletter) {
        this._id_user = id_user;
        this._numero_licence = numero_licence;
        this._role = role;
        this._charte_signe = charte_signe;
        this._google_id = google_id;
        this._facebook_id = facebook_id;
        this._newsletter = newsletter;
    }

    get id_user() {
        return this._id_user;
    }

    set id_user(value) {
        this._id_user = value;
    }

    get numero_licence() {
        return this._numero_licence;
    }

    set numero_licence(value) {
        this._numero_licence = value;
    }

    get role() {
        return this._role;
    }

    set role(value) {
        this._role = value;
    }

    get charte_signe() {
        return this._charte_signe;
    }

    set charte_signe(value) {
        this._charte_signe = value;
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

    get newsletter() {
        return this._newsletter;
    }

    set newsletter(value) {
        this._newsletter = value;
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
        return new User(userData.id_user,
            userData.numero_licence,
            userData.role,
            userData.charte_signe,
            userData.google_id,
            userData.facebook_id,
            userData.newsletter);
    }
}

module.exports = User;