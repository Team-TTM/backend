const express = require('express');
const router = express.Router();
const {authenticateDirigeant, authenticateJWT} = require('../middleware/auth');
const eventController = require('../controllers/eventController');
const checkoutEventId = require('../middleware/checkoutEventId');

router.get('/',authenticateJWT,eventController.getEvents);
router.post('/', authenticateJWT, authenticateDirigeant, eventController.createEvent);
router.put('/', authenticateJWT, authenticateDirigeant, eventController.updateEvent);
router.delete('/:eventId', authenticateJWT, authenticateDirigeant, checkoutEventId, eventController.deleteEvent);
router.post('/subscribe/:eventId', authenticateJWT, checkoutEventId, eventController.subscribeEvent);
router.get('/subscribe', authenticateJWT, eventController.getSubscribeEvent);
router.get('/:eventId', authenticateJWT, checkoutEventId, eventController.getEvent);
router.delete('/unsubscribe/:eventId', authenticateJWT, checkoutEventId, eventController.unsubscribeEvent);

router.all('/{*splat}', (req, res) => {
    return res.status(404).json({error: 'Route non trouvée'});
});


module.exports = router;