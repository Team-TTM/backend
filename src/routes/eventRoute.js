const express = require('express');
const router = express.Router();
const {authenticateDirigeant, authenticateJWT} = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('/',authenticateJWT,eventController.getEvents);
router.get('/:eventId',authenticateJWT,eventController.getEvent);
router.post('/',authenticateDirigeant,eventController.createEvent);
router.put('/',authenticateDirigeant,eventController.editEvent);
router.delete('/:eventId',authenticateDirigeant,eventController.deleteEvent);


module.exports = router;