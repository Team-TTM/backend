const express = require('express');
const router = express.Router();
const {authenticateDirigeant, authenticateJWT} = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('/',authenticateJWT,eventController.getEvents);
router.get('/:eventId',authenticateJWT,eventController.getEvent);
router.post('/',authenticateJWT,authenticateDirigeant,eventController.createEvent);
router.put('/',authenticateJWT,authenticateDirigeant,eventController.updateEvent);
router.delete('/:eventId',authenticateJWT,authenticateDirigeant,eventController.deleteEvent);

router.all('/{*splat}', (req, res) => {
    return res.status(404).json({error: 'Route non trouvée'});
});


module.exports = router;