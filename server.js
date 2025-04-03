// server.js
const { app, logConsole } = require('./app'); // Importer l'application Express
const port = process.env.PORT || 3001; // Le port HTTPS standard est 443 (ne sera pas utilisé directement si Passenger gère SSL)

// Démarrer le serveur HTTPS (géré par Passenger si SSL est configuré)
const startServer = () => {
    try {
        const server = app.listen(port, () => {
            console.log(`Serveur Express en écoute sur le port ${port}`);
        });

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`Le port ${port} est déjà utilisé. Veuillez utiliser un autre port.`);
                process.exit(1);
            } else {
                console.error(`Erreur lors du démarrage du serveur : ${err.message}`);
                process.exit(1);
            }
        });
    } catch (err) {
        console.error(`Erreur lors du démarrage du serveur : ${err.message}`);
        process.exit(1); // Arrêt du processus en cas d'erreur
    }
};

startServer();