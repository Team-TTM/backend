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
     * @param {String} type - type de l'événement.
     * @param {int} nombreMax - Le nombre de participants maximum a l'événement.
     * @param {String} lieu - Lieux de l'événement.
     */
    constructor(eventId, dirigeantId, name, description, createdAT, endAt, participants, type, nombreMax, lieu) {
        this.eventId = eventId;
        this.dirigeantId = dirigeantId;
        this.name = name;
        this.description = description;
        this.createdAT = createdAT;
        this.endAt = endAt;
        this.participants = participants;
        this.type = type;
        this.nombreMax = nombreMax;
        this.lieu = lieu;
    }

    /**
     * Crée un événement à partir des données de la base de données.
     * @param {Object} eventData - Données récupérées depuis la base de données.
     * @param {number} eventData.event_id - L'ID de l'événement.
     * @param {number} eventData.dirigeant_id - L'ID du dirigeant associé à l'événement.
     * @param {string} eventData.name - Le nom de l'événement.
     * @param {string} eventData.description - La description de l'événement.
     * @param {string} eventData.created_at - La date de création de l'événement (format ISO).
     * @param {string} eventData.end_at - La date de fin de l'événement (format ISO).
     * @param {string} eventData.type - Le type de l'événement.
     * @param {number} eventData.nombre_max - Le nombre maximum de participants.
     * @param {string} eventData.lieux - Le lieu de l'événement.
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
            [],
            eventData.type,
            eventData.nombre_max,
            eventData.lieux
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
        if (!data?.type || typeof data?.type !== 'string') {
            throw new Error('type manquant ou invalide');
        }
        if (!data?.nombreMax || typeof data?.nombreMax !== 'number') {
            throw new Error('nombreMax manquant ou invalide');
        }
        if (!data?.lieu || typeof data?.lieu !== 'string') {
            throw new Error('lieu manquant ou invalide');
        }

        return new Event(
            null,
            userId,
            data.name,
            data.description,
            formattedDate,
            data.endAt,
            null,
            data.type,
            data.nombreMax,
            data.lieu
        );
    }

    /**
     * Crée un nouvel événement à partir des données de la requête.
     * @param {Object} data - Données de l'événement.
     * @param {int} data.eventId - Le nom de l'événement.
     * @param {string} data.name - Le nom de l'événement.
     * @param {string} data.description - La description de l'événement.
     * @param {string} data.endAt - La date de fin de l'événement (format ISO).
     * @param {number} userId - L'ID de l'utilisateur qui crée l'événement.
     * @returns {Event} L'instance de l'événement créé.
     * @throws {Error} Si les données sont invalides.
     */
    static editEvent(data, userId) {
        if (!data?.eventId || typeof data?.eventId !== 'number') {
            throw new Error('Id de l\'événement manquant ou invalide');
        }
        if (!data?.name || typeof data?.name !== 'string') {
            throw new Error('Nom de l\'événement manquant ou invalide');
        }

        if (!data?.description || typeof data?.description !== 'string') {
            throw new Error('Description manquante ou invalide');
        }
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!data?.endAt || !regex.test(data?.endAt)) {
            throw new Error('endAt manquante ou invalide');
        }
        if (!data?.type || typeof data?.type !== 'string') {
            throw new Error('type manquant ou invalide');
        }
        if (!data.nombre_max || typeof data.nombre_max !== 'number') {
            throw new Error('nombreMax manquant ou invalide');
        }
        if (!data.lieu || typeof data.lieu !== 'string') {
            throw new Error('lieu manquant ou invalide');
        }

        return new Event(
            data.eventId,
            userId,
            data.name,
            data.description,
            null,
            data.endAt,
            null,
            data.type,
            data.nombre_max,
            data.lieu
        );
    }
}

module.exports = Event;