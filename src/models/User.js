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

    static createFacebookUser(facebookId) {
        return new User(null,
            null,
            "user",
            false,
            null,
            facebookId,false)
    }

    static createGoogleUser(googleId) {
        return new User(null,
            null,
            "user",
            false,
            googleId,
            null,
            false)
    }

    static createUserFromDataBase(userData) {
        return new User(userData.id_user,
            userData.numero_licence,
            userData.role,
            userData.charte_signe,
            userData.google_id,
            userData.facebook_id,
            userData.newsletter)
    }
    set id_user(value) {
        this._id_user = value;
    }

    set numero_licence(value) {
        this._numero_licence = value;
    }

    set role(value) {
        this._role = value;
    }

    set charte_signe(value) {
        this._charte_signe = value;
    }

    set google_id(value) {
        this._google_id = value;
    }

    set facebook_id(value) {
        this._facebook_id = value;
    }

    set newsletter(value) {
        this._newsletter = value;
    }

    get id_user() {
        return this._id_user;
    }

    get numero_licence() {
        return this._numero_licence;
    }

    get role() {
        return this._role;
    }

    get charte_signe() {
        return this._charte_signe;
    }

    get google_id() {
        return this._google_id;
    }

    get facebook_id() {
        return this._facebook_id;
    }

    get newsletter() {
        return this._newsletter;
    }
}

module.exports = User;