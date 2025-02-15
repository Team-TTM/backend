class User {
    constructor(id_user, numero_licence, role, charte_signe, google_id, facebook_id, newsletter) {
        this.id_user = id_user;
        this.numero_licence = numero_licence;
        this.role = role;
        this.charte_signe = charte_signe;
        this.google_id = google_id;
        this.facebook_id = facebook_id;
        this.newsletter = newsletter;
    }


}

module.exports = User;