/**
 * Classe représentant un événement.
 */
class Event {
    /**
     * Crée une instance de l'événement.
     * @param {number} eventId - L'ID de l'événement.
     * @param {number} dirigeantId - L'ID du dirigeant associé à l'événement.
     * @param {string} name - Le nom de l'événement.
     * @param {string} description - La description de l'événement.
     * @param {string} createdAT - La date de création de l'événement (format ISO).
     * @param {string} endAt - La date de fin de l'événement (format ISO).
     * @param {Array} participants - Liste des participants à l'événement.
     */
    constructor(eventId, dirigeantId, name, description, createdAT, endAt, participants) {
        this.eventId = eventId;
        this.dirigeantId = dirigeantId;
        this.name = name;
        this.description = description;
        this.createdAT = createdAT;
        this.endAt = endAt;
        this.participants = participants;
    }

    /**
     * Crée un événement à partir des données de la base de données.
     * @param {Object} eventData - Données récupérées depuis la base de données.
     * @param {number} eventData.event_id - L'ID de l'événement.
     * @param {number} eventData.dirigeant_id - L'ID du dirigeant associé.
     * @param {string} eventData.name - Le nom de l'événement.
     * @param {string} eventData.description - La description de l'événement.
     * @param {string} eventData.created_at - La date de création de l'événement (format ISO).
     * @param {string} eventData.end_at - La date de fin de l'événement (format ISO).
     * @returns {Event} L'instance de l'événement.
     */
    static fromDataBase(eventData) {
        return new Event(
            eventData.event_id,
            eventData.dirigeant_id,
            eventData.name,
            eventData.description,
            eventData.created_at,
            eventData.end_at,
            []
        );
    }

    /**
     * Crée un événement à partir des données de la requête.
     * @param {Object} data - Données de l'événement.
     * @param {number} data.eventId - L'ID de l'événement.
     * @param {number} data.dirigeantId - L'ID du dirigeant associé.
     * @param {string} data.name - Le nom de l'événement.
     * @param {string} data.description - La description de l'événement.
     * @param {string} data.createdAT - La date de création de l'événement (format ISO).
     * @param {string} data.endAt - La date de fin de l'événement (format ISO).
     * @param {Array} data.participants - Liste des participants à l'événement.
     * @returns {Event} L'instance de l'événement.
     * @throws {Error} Si les données sont invalides.
     */
    static fromRequestData(data) {
        if (!data?.eventId || typeof data?.eventId !== 'number') {
            throw new Error('eventId manquant ou invalide');
        }

        if (!data?.dirigeantId || typeof data?.dirigeantId !== 'number') {
            throw new Error('dirigeantId manquant ou invalide');
        }

        if (!data?.name || typeof data?.name !== 'string') {
            throw new Error('Nom de l\'événement manquant ou invalide');
        }

        if (!data?.description || typeof data?.description !== 'string') {
            throw new Error('Description manquante ou invalide');
        }

        if (!data?.createdAT || isNaN(new Date(data?.createdAT).getTime())) {
            throw new Error('createdAT manquante ou invalide');
        }

        if (!data?.endAt || isNaN(new Date(data?.endAt).getTime())) {
            throw new Error('endAt manquante ou invalide');
        }

        if (!Array.isArray(data?.participants)) {
            throw new Error('participants manquants ou invalides');
        }

        return new Event(
            data.eventId,
            data.dirigeantId,
            data.name,
            data.description,
            data.createdAT,
            data.endAt,
            data.participants
        );
    }

    /**
     * Crée un nouvel événement à partir des données de la requête.
     * @param {Object} data - Données de l'événement.
     * @param {string} data.name - Le nom de l'événement.
     * @param {string} data.description - La description de l'événement.
     * @param {string} data.endAt - La date de fin de l'événement (format ISO).
     * @param {number} userId - L'ID de l'utilisateur qui crée l'événement.
     * @returns {Event} L'instance de l'événement créé.
     * @throws {Error} Si les données sont invalides.
     */
    static createEvent(data, userId) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

        if (!data?.name || typeof data?.name !== 'string') {
            throw new Error('Nom de l\'événement manquant ou invalide');
        }

        if (!data?.description || typeof data?.description !== 'string') {
            throw new Error('Description manquante ou invalide');
        }

        if (!data?.endAt || isNaN(new Date(data?.endAt).getTime())) {
            throw new Error('endAt manquante ou invalide');
        }

        return new Event(
            null,
            userId,
            data.name,
            data.description,
            formattedDate,
            data.endAt,
            null
        );
    }

    /**
     * Ajoute un participant à l'événement.
     * @param {Object} participant - Le participant à ajouter.
     */
    addParticipant(participant) {
        this.participants.push(participant);
    }
}

module.exports = Event;