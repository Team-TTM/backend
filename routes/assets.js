const express = require('express');
const router = express.Router();
const path = require('path');

// Servir les fichiers statiques du dossier 'assets' sous la route '/assets'
router.use(express.static(path.join(__dirname, '..', 'dist', 'assets')));

module.exports = router;