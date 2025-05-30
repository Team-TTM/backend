const express = require('express');
const passport = require('./src/config/passport');
const { morganLogger, logConsole } = require('./logger'); // Importer le logger

const app = express();

// Routes
const indexRouter = require('./src/routes/index');
const usersRouter = require('./src/routes/userRoute');
const assetsRouter = require('./src/routes/assets');
const eventRouter = require('./src/routes/eventRoute');
const importRouter = require('./src/routes/importRoute');
const authRouter = require('./src/routes/authRoute');
const adherentRouter = require('./src/routes/adherentRoute');

// Middleware
app.use(morganLogger); // Utilisation de Morgan pour logger les requêtes HTTP
app.use(express.json());
app.use(passport.initialize());

// Définir les routes
app.use(indexRouter);
app.use('/users', usersRouter);
app.use('/assets', assetsRouter);
app.use('/api/events', eventRouter);
app.use('/api/import', importRouter);
app.use('/api/auth', authRouter);
app.use('/api/adherent', adherentRouter);

// Gestion des erreurs 404
app.use((req, res, next) => {
    const error = new Error('Ressource non trouvée');
    error.status = 404;
    next(error);
});



// Middleware de gestion des erreurs globales
app.use((error, req, res) => {
    res.status(error.status && Number.isInteger(error.status) ? error.status : 500);
    res.json({
        error: {
            message: error.message || 'Erreur serveur',
        },
    });
});

module.exports = { app, logConsole };