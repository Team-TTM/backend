const express = require('express');
const router = express.Router();
const {authenticateDirigeant} = require('../middleware/auth');
const eventController = require('../controllers/eventController');

router.get('getEvents',authenticateDirigeant,eventController.getEvents);
router.get('getEvent/:id',authenticateDirigeant,eventController.getEvent);
router.post('createEvent',authenticateDirigeant,eventController.createEvent);
router.put('editEvent',authenticateDirigeant,eventController.editEvent);
router.delete('deleteEvent/:id',authenticateDirigeant,eventController.deleteEvent);


module.exports = router;