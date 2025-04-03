const express = require('express');
const router = express.Router();
const adherentController = require('../controllers/adherentController');
const path = require('path');
const {authenticateJWT, authenticateDirigeant} = require('../middleware/auth');


router.get('/all', authenticateJWT, authenticateDirigeant, adherentController.getAllAdherents);

router.get('/', authenticateJWT, adherentController.getAdherent);

router.post('/update-adherent', authenticateJWT, adherentController.updateAdherent);


router.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', '..', 'frontend', 'dist', 'index.html'));
});
module.exports = router;
