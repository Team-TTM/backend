const pool = require('../config/database'); // Connexion à la base de données


const createEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Création d\'un événement...');
    const data = req?.body?.event;
    const {userId} = req.auth;
    try {
        if (data === undefined) {
            console.error('Objet Event manquant dans la requête');
            return res.status(400).json({
                error: 'Objet Event manquant dans la requête',
            });
        }
        const event = Event.createEvent(data,userId);
        const query = `
            INSERT INTO events (dirigeant_id, name, description,created_at, end_at)
            VALUES (?, ?, ?,?, ?)
            RETURNING *;
        `;
        const [rows] = await pool.query(query, [event.dirigeantId, event.name, event.description, event.createdAT,event.endAt]);
        const eventFetch = Event.fromDataBase(rows[0]);
        return res.status(200).json({ eventFetch });
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la création de l\'événement :', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

const editEvent = async (req, res) => {
    try {
        const event = Event.fromDataBase(req.body);
        const query = `UPDATE events
                       SET dirigeant_id = ?,
                           name         = ?,
                           description  = ?,
                           end_at       = ?
                       WHERE event_id = ?;
        `;
        await pool.execute(query, [event.dirigeantId, event.name, event.description, event.endAt, event.eventId]);
        return res.status(200).json({ message: 'Événement modifié avec succès' });
    } catch (error) {
        console.error(`❌ [CONTROLLER] Erreur lors de la modification de l\'événement : ${error}`);
        return res.status(500).json({
            error: error.message
        });
    }
};


const deleteEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Suppression d\'un événement...');
    const eventId = req.params?.eventId;
    if (eventId === undefined) {
        console.error('Événement non trouvé');
        return res.status(400).json({
            error: 'Événement non trouvé',
        });
    }
    try {
        const query = 'SELECT * FROM events WHERE event_id = ?';
        const [rows] = await pool.execute(query, [eventId]);
        if (rows.length === 0) {
            console.log('⚠️ Aucun événement trouvé.');
            return res.status(204).send(); // 204 : Pas d'événement trouvé
        }
        const event = Event.fromDataBase(rows[0]);
        const query2 = 'DELETE FROM events WHERE event_id = ?;'; // Correction du "delete events"
        await pool.execute(query2, [event.eventId]);
        return res.status(200).json({ message: 'Événement supprimé avec succès' });
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la suppression de l\'événement :', error);
        return res.status(500).json({
            error: error.message
        });
    }
};

const getEvent = async (req, res) => {
    console.log('📌 [CONTROLLER] Récupération de l\'événement...');
    const eventId = parseInt(req.params?.eventId, 10);

    if (!eventId) {
        console.error('ID de l\'événement manquant');
        return res.status(400).json({
            error: 'ID de l\'événement manquant',
        });
    }

    if (isNaN(eventId)) {
        return res.status(400).json({ error: 'eventId est invalide' });
    }

    try {
        const query = 'SELECT * FROM events WHERE event_id = ?';
        const [rows] = await pool.execute(query, [eventId]);
        if (rows.length === 0) {
            console.log('⚠️ Aucun événement trouvé pour cet ID.');
            return res.status(204).send();
        }

        const event = Event.fromDataBase(rows[0]);
        // const query2 = `SELECT a.adherents
        //                 FROM adherents a
        //                          JOIN users u ON u.id_user = a.id_user
        //                          JOIN events_users eu ON u.user_id = eu.user_id
        //                          JOIN events_event_id e ON e.event_id = eu.event_id
        //                 WHERE e.event_id = ?;`;
        // const result = await pool.execute(query2, [event.eventId]);
        //
        // result[0].forEach(row => {
        //     const adherent = Adherent.fromDataBase(row);
        //     event.addParticipant(adherent);
        // });

        return res.status(200).json({ event });
    } catch (error) {
        console.error('❌ [CONTROLLER] Erreur lors de la récupération de l\'événement:', error);
        return res.status(500).json({
            error: 'Erreur interne du serveur'
        });
    }
};

const getEvents = async (req, res) => {
    try {
        console.log('📌 [CONTROLLER] Récupération des événements...');
        const query = 'SELECT * FROM events';
        const [rows] = await pool.execute(query);
        const events = [];
        for (const row of rows) {
            const event = Event.fromDataBase(row);
            events.push(event);
        }
        if (events.length === 0) {
            console.log('⚠️ Aucun événement trouvé.');
            return res.status(204).send(); // 204 : Pas d'événements trouvés
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



module.exports = {
    createEvent,
    editEvent,
    deleteEvent,
    getEvents,
    getEvent
};

class Event {
    constructor(eventId, dirigeantId, name, description, createdAT, endAt, participants) {
        this.eventId = eventId;
        this.dirigeantId = dirigeantId;
        this.name = name;
        this.description = description;
        this.createdAT = createdAT;
        this.endAt = endAt;
        this.participants = participants;

    }

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
    };

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

        // Vérification de la description
        if (!data?.description || typeof data?.description !== 'string') {
            throw new Error('Description manquante ou invalide');
        }

        // Vérification de createdAT (doit être une date valide)
        if (!data?.createdAT || isNaN(new Date(data?.createdAT).getTime())) {
            throw new Error('createdAT manquante ou invalide');
        }

        // Vérification de endAt (doit être une date valide)
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

    };

    addParticipant(participant) {
        this.participants.push(participant);
    }

    static createEvent(data,userId) {
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"

        if (!data?.name || typeof data?.name !== 'string') {
            throw new Error('Nom de l\'événement manquant ou invalide');
        }

        // Vérification de la description
        if (!data?.description || typeof data?.description !== 'string') {
            throw new Error('Description manquante ou invalide');
        }
        // Vérification de endAt (doit être une date valide)
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
            null,
        );
    };
}