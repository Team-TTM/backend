const express = require('express');
const router = express.Router();
const path = require('path');

// Définition du chemin du dossier des assets
const assetsPath = path.resolve(__dirname, '..', 'dist', 'assets');

// Servir les fichiers statiques du dossier assets
router.use(express.static(assetsPath));

module.exports = router;