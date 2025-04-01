// eslint-disable-next-line consistent-return
const checkoutEventId = async (req, res, next) => {
    try {
        const eventId = +req.params?.eventId;
        if (eventId === undefined) {
            return res.status(400).json({error: 'Event Id manquant'});
        }
        if (isNaN(eventId)) {
            return res.status(400).json({error: 'eventId est invalide'});
        }
        req.params.eventId = eventId;
        next();
    } catch (err) {
        console.error(`Erreur inattendue : ${err.message}`);
        return res.status(400).json(err.message);
    }
};

module.exports = checkoutEventId;
