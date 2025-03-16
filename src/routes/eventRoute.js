const express = require('express');
const router = express.Router();
const {authenticateDirigeant, authenticateJWT} = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('/get',authenticateJWT,eventController.getEvents);
router.get('/get/:eventId',authenticateJWT,eventController.getEvent);
router.post('/create',authenticateDirigeant,eventController.createEvent);
router.put('/edit',authenticateDirigeant,eventController.editEvent);
router.delete('/delete/:eventId',authenticateDirigeant,eventController.deleteEvent);


module.exports = router;