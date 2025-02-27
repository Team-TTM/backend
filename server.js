const express = require('express');
const app = express();

const logger = require('morgan');
const passport = require("./src/config/passport");
const port = process.env.PORT || 3000; // Le port HTTPS standard est 443 (ne sera pas utilisé directement si Passenger gère SSL)

// Routes
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/userRoute');
const assetsRouter = require('./src/routes/assets');
const { initDatabase, dropAllTables } = require("./src/database/init-db");

// Démarrer le serveur HTTPS (géré par Passenger si SSL est configuré)
const startServer =  () => {
    try {
        // await dropAllTables();  // Supprime toutes les tables avant d'initialiser la DB
        // await initDatabase();  // Initialise la base de données

        // Démarrer le serveur via Passenger
        app.listen(port, () => {
            console.log(`Serveur Express en écoute sur le port ${port}`);
        });
    } catch (err) {
        console.error('Erreur lors du démarrage du serveur :', err);
        process.exit(1);  // Arrêt du processus en cas d'erreur
    }
};

app.use(logger('dev'));
app.use(passport.initialize());
app.use(express.json());

// Ordre logique des routes
app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/assets', assetsRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
    const error = new Error('Ressource non trouvée');
    error.status = 404;
    next(error);
});

// Middleware de gestion des erreurs globales
app.use((error, req, res, next) => {
    res.status(error.status && Number.isInteger(error.status) ? error.status : 500);
    res.json({
        error: {
            message: error.message || 'Erreur serveur',
        },
    });
});

// Connexion à et démarrage du serveur
startServer();