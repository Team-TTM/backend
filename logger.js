const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

// Créer un répertoire de logs (si ce n'est pas déjà fait)
const logDirectory = path.join(__dirname, 'logs');


// Créer un flux d'écriture vers un fichier de log avec une rotation quotidienne
const logStream = rfs.createStream('server.log', {
    interval: '1d',   // La log est coupée tous les jours
    path: logDirectory
});


// Rediriger la sortie de `console.log` et `console.error` vers un fichier tout en affichant dans la console
const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    const message = `[${new Date().toISOString()}] INFO: ${args.join(' ')}`;
    originalLog.apply(console, args); // Affiche dans la console
    logStream.write(message + '\n'); // Écrit dans le fichier
};

console.error = function (...args) {
    const message = `[${new Date().toISOString()}] ERROR: ${args.join(' ')}`;
    originalError.apply(console, args); // Affiche dans la console
    logStream.write(message + '\n'); // Écrit dans le fichier
};
// Exposez la configuration de morgan et les méthodes de log
const morganLogger = morgan('combined', { stream: logStream });

module.exports = { morganLogger };