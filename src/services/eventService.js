const eventModel = require('../models/repositories/eventModel');

/**
 * Crée un nouvel événement en utilisant le modèle Event.
 *
 * @param {Event} event - L'objet Event contenant les détails de l'événement à créer.
 * @returns {Promise<Event>} - Une promesse qui résout avec l'objet Event créé.
 * @throws {Error} - Lance une erreur si la création de l'événement échoue.
 */
const createEvent = async (event) => {
    return await eventModel.createEvent(event);
};

/**
 * Met à jour un événement existant.
 *
 * @param {Event} event - L'objet Event contenant les nouvelles informations de l'événement.
 * @returns {Promise<null>} - Retourne true si la mise à jour a réussi, sinon false.
 * @throws {Error} - Lance une erreur si l'événement n'existe pas ou si la mise à jour échoue.
 */
const updateEvent = async (event) => {
    if (!await eventModel.exist(event.eventId)) {
        throw new Error(`Aucun événement trouvé avec l'id ${event.eventId}`);
        return false;
    }
    return await eventModel.updateEvent(event);
};

/**
 * Supprime un événement existant.
 *
 * @param {number} eventId - L'ID de l'événement à supprimer.
 * @returns {Promise<boolean>} - Retourne true si la suppression a réussi, sinon false.
 * @throws {Error} - Lance une erreur si la suppression échoue.
 */
const deleteEvent = async (eventId) =>{
    return await eventModel.deleteEvent(eventId);
};
/**
 * Récupère un événement par son ID.
 *
 * @param {number} eventId - L'ID de l'événement à récupérer.
 * @returns {Promise<Event|null>} - Une promesse qui résout avec l'objet Event récupéré ou null si aucun événement n'est trouvé.
 * @throws {Error} - Lance une erreur si la récupération échoue.
 */
const getEvent = async (eventId) => {
    const [event, participants] = await Promise.all([
        eventModel.getEvent(eventId),
        eventModel.getParticipant(eventId)
    ]);
    if (!event) {
        return null;
    } else {
        event.participants = participants;
        return event;
    }
};

/**
 * Récupère tous les événements.
 *
 * @returns {Promise<Event[]>} - Une promesse qui résout avec un tableau d'objets Event.
 * @throws {Error} - Lance une erreur si la récupération échoue.
 */
const getAllEvents = async () => {
    return await eventModel.getAllEvents();
};

const subscribeEvent = async (eventId, userId) => {
    return await eventModel.subscribeEvent(eventId, userId);
};

const unsubscribeEvent = async (eventId, userId) => {
    return await eventModel.unsubscribeEvent(eventId, userId);
};
const getSubscribeEvent = async (userId) => {
    return await eventModel.getSubscribeEvent(userId);
};

module.exports = {
    createEvent,
    deleteEvent,
    getEvent,
    getAllEvents,
    updateEvent,
    subscribeEvent,
    unsubscribeEvent,
    getSubscribeEvent
};