class Participant {
    constructor(nom, prenom, numeroLicence) {
        this.nom = nom;
        this.prenom = prenom;
        this.numeroLicence = numeroLicence;
    }

    static fromDatabaseArray(datas) {
        const participants = [];
        datas.forEach((data) => {
            participants.push(this.fromDataBase(data));
        });
        return participants;
    }

    static fromDataBase(data) {
        return new Participant(
            data.nom,
            data.prenom,
            data.licence_id,
        );
    }
}

module.exports = Participant;
