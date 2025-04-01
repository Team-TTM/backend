const pool = require('../../config/database');
const Event = require('../entities/Event');
const Participant = require('../entities/Participant');
/**
 * Crée un nouvel événement dans la base de données.
 *
 * @param {Event} event - L'objet Event contenant les détails de l'événement à créer.
 * @returns {Promise<Event>} - Une promesse qui résout avec l'objet Event créé.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const createEvent = async (event) => {
    const query = `
        INSERT INTO events (dirigeant_id, name, description, created_at, end_at)
        VALUES (?, ?, ?, ?, ?)
        RETURNING *;
    `;
    const [rows] = await pool.query(query, [event.dirigeantId, event.name, event.description, event.createdAT, event.endAt]);
    return Event.fromDataBase(rows[0]);
};

/**
 * Supprime un événement de la base de données.
 *
 * @param {number} eventId - L'ID de l'événement à supprimer.
 * @returns {Promise<boolean>} - Retourne true si l'événement a été supprimé, false sinon.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const deleteEvent = async (eventId) => {
    const query2 = 'DELETE FROM events WHERE event_id = ?;';
    const result = await pool.execute(query2, [eventId]);
    const [ResultSetHeader] = result;
    return ResultSetHeader.affectedRows > 0;
};

/**
 * Met à jour un événement existant dans la base de données.
 *
 * @param {Event} event - L'objet Event contenant les nouvelles informations de l'événement.
 * @returns {Promise<boolean>} - Retourne true si la mise à jour a été effectuée, false sinon.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const updateEvent = async (event) => {
    if (!event || typeof event !== 'object') {
        throw new Error('L\'événement fourni est invalide.');
    }

    try {
        const query = `
            UPDATE events
            SET
                name = ?,
                description = ?,
                end_at = ?
            WHERE
                event_id = ?
              AND (name != ? OR description != ? OR end_at != ?);
        `;

        const values = [
            event.name ?? null,
            event.description ?? null,
            event.endAt ?? null,
            event.eventId ?? null,
            event.name ?? null,
            event.description ?? null,
            event.endAt ?? null
        ];

        const [result] = await pool.execute(query, values);

        return result.affectedRows > 0;
    } catch (error) {
        console.error('❌ [MODEL] Erreur lors de la mise à jour de l\'événement :', error);
        throw new Error('Une erreur est survenue lors de la mise à jour de l\'événement.');
    }
};

/**
 * Récupère un événement par son ID.
 *
 * @param {number} eventId - L'ID de l'événement à récupérer.
 * @returns {Promise<Event|null>} - Une promesse qui résout avec l'objet Event récupéré ou null si aucun événement n'est trouvé.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const getEvent = async (eventId) => {
    const query = 'SELECT * FROM events WHERE event_id = ?';
    const [rows] = await pool.execute(query, [eventId]);
    if (rows.length === 0) {
        console.log('⚠️ Aucun événement trouvé pour cet ID.');
        return null;
    }
    return Event.fromDataBase(rows[0]);
};

/**
 * Récupère tous les événements de la base de données.
 *
 * @returns {Promise<Event[]>} - Une promesse qui résout avec un tableau d'objets Event.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const getAllEvents = async () => {
    const query = 'SELECT * FROM events';
    const [rows] = await pool.execute(query);
    const events = [];
    for (const row of rows) {
        const event = Event.fromDataBase(row);
        events.push(event);
    }
    return events;
};

/**
 * Vérifie si un événement existe dans la base de données.
 *
 * @param {number} eventId - L'ID de l'événement à vérifier.
 * @returns {Promise<boolean>} - Retourne true si l'événement existe, false sinon.
 * @throws {Error} - Lance une erreur si la requête SQL échoue.
 */
const exist = async (eventId) => {
    const query = `SELECT *
                   FROM events
                   WHERE event_id = ?;
    `;
    const [rows] = await pool.execute(query, [eventId]);
    return rows.length > 0;
};

const subscribeEvent = async (eventId, userId) => {
    const query = `
        INSERT IGNORE INTO events_users (event_id, user_id)
        VALUES (?, ?);`
    ;
    const [result] = await pool.execute(query, [eventId, userId]);
    return result.affectedRows > 0;
};
const unsubscribeEvent = async (eventId, userId) => {
    const query = `
        DELETE
        FROM events_users
        WHERE event_id = ?
          AND user_id = ?;`
    ;
    const [result] = await pool.execute(query, [eventId, userId]);
    return result.affectedRows > 0;
};
const getParticipant = async (eventId) => {
    const query = `
        SELECT a.nom, a.prenom, a.licence_id
        FROM adherents a
                 JOIN users u ON a.licence_id = u.licence_id
                 JOIN events_users eu ON u.user_id = eu.user_id
        WHERE event_id = ?;`
    ;
    const [rows] = await pool.execute(query, [eventId]);
    return Participant.fromDatabaseArray(rows);
};
module.exports = {
    createEvent,
    deleteEvent,
    getEvent,
    getAllEvents,
    updateEvent,
    exist,
    subscribeEvent,
    unsubscribeEvent,
    getParticipant,
};