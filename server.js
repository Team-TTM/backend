// server.js
const { app, logConsole } = require('./app'); // Importer l'application Express
const port = process.env.PORT || 3000; // Le port HTTPS standard est 443 (ne sera pas utilisé directement si Passenger gère SSL)

// Démarrer le serveur HTTPS (géré par Passenger si SSL est configuré)
const startServer = () => {
    try {
        app.listen(port, () => {
            console.log(`Serveur Express en écoute sur le port ${port}`, 'INFO');
        });
    } catch (err) {
        console.error(`Erreur lors du démarrage du serveur : ${err.message}`, 'ERROR');
        process.exit(1);  // Arrêt du processus en cas d'erreur
    }
};

startServer();