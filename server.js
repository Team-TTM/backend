const express = require('express');
const logger = require('morgan');
const path = require('path');

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/user')

const app = express();

app.use(logger('dev')) // 'dev' affiche un format de log compact avec méthode, URL, et statut


// app.use(express.static(path.join(__dirname, 'dist')));

app.use('/', indexRouter);

app.use(express.json());

app.use('/users', usersRouter);

app.use((req, res, next) => {
    const error = new Error('Ressource non trouvée');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message,
        },
    });
});

const port = 3000;
app.listen(port, () => {
    console.log(`Serveur en écoute sur http://localhost:${port}`);
});


