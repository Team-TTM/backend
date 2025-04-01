const eventService = require('../services/eventService');
const Event = require('../models/entities/Event');

/**
 * Crée un nouvel événement.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>} - Une promesse qui résout avec la réponse HTTP.
 */
const createEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Création d\'un événement...');
    const data = req?.body?.event;
    const {userId} = req.auth;
    let event;
    try {
        if (data === undefined) {
            console.error('Objet Event manquant dans la requête');
            return res.status(400).json({error: 'Objet Event manquant dans la requête',});
        }
        event = Event.createEvent(data,userId);
    }catch(err) {
        console.error(err);
        return res.status(400).json(err.message);
    }
    try {
        const eventFetch = await eventService.createEvent(event);
        return res.status(201).json({ eventFetch });
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la création de l\'événement :', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Met à jour un événement existant.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>} - Une promesse qui résout avec la réponse HTTP.
 */
const updateEvent = async (req, res) => {
    const data = req?.body?.event;
    const {userId} = req.auth;
    let event;
    try {
        if (data === undefined) {
            console.error('Objet Event manquant dans la requête');
            return res.status(400).json({
                error: 'Objet Event manquant dans la requête',
            });
        }
        event = Event.editEvent(data, userId);
    } catch (err) {
        console.error(err);
        return res.status(400).json(err.message);
    }
    try {
        const newEvent = await eventService.updateEvent(event);
        return res.status(200).json(newEvent);
    } catch (error) {
        console.error(`❌ [CONTROLLER] Erreur lors de la modification de l\'événement : ${error}`);
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Supprime un événement existant.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>} - Une promesse qui résout avec la réponse HTTP.
 */
const deleteEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Suppression d\'un événement...');
    let eventId;
    try{
        eventId = validateEventId(req.params?.eventId);
    }catch(err) {
        console.error(err);
        return res.status(400).json(err.message);
    }
    try {
        const isDeleted = await eventService.deleteEvent(eventId);
        if (isDeleted) {
            return res.status(200).send();
        } else {
            return res.status(404).send();
        }
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la suppression de l\'événement :', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Récupère un événement par son ID.
 *
 * @param {import('express').Request} req - Objet de requête Express.
 * @param {import('express').Response} res - Objet de réponse Express.
 * @returns {Promise<void>} - Une promesse qui résout avec la réponse HTTP.
 */
const getEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Récupération de l\'événement...');
    let eventId;
    try{
        eventId = validateEventId(req.params?.eventId);
    }catch(err) {
        return res.status(400).json(err.message);
    }
    try {
        const event = await eventService.getEvent(eventId);
        if (!event) {
            return res.status(404).send();
        } else {
            return res.status(200).json({event});
        }
    } catch (error) {
        if (error.message === 'Événement non trouvé' || error.message === 'eventId est invalide') {
            return res.status(400).json({ error: error.message });
        }

        console.error('❌ [CONTROLLER] Erreur lors de la récupération de l\'événement:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur. Veuillez réessayer plus tard.'
        });
    }
};

const getEvents = async (req, res) => {
    try {
        console.log('📌 [CONTROLLER] Récupération des événements...');
        const events = await eventService.getAllEvents();
        if (events.length === 0) {
            console.log('⚠️ Aucun événement trouvé.');
            return res.status(404).send(); // 404 : Pas d'événements trouvés
        }
        console.log(`✅ ${events.length} événements récupérés avec succès.`);
        return res.status(200).json({ events });
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la récupération des événements :', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Valide l'eventId pour vérifier qu'il est défini et un nombre.
 * @param {string} string - L'ID de l'événement à valider.
 * @returns {int} - Retourne vrai si l'eventId est valide, sinon faux.
 */
const validateEventId = (string) => {
    const eventId= +string;
    if (eventId === undefined) {
        console.error('⚠️ Événement non trouvé');
        throw new Error('Événement non trouvé');
    }
    if (isNaN(eventId)) {
        throw new Error('eventId est invalide');
    }
    return eventId;
};

module.exports = validateEventId;

module.exports = {
    createEvent,
    updateEvent,
    deleteEvent,
    getEvents,
    getEvent
};
