const {initDatabase, dropAllTables} = require('./init-db');


dropAllTables().then(() => {
    initDatabase()
        .then(() => console.log('✅ Initialisation terminée'))
        .catch(err => console.error('❌ Erreur lors de l\'initialisation :', err));
});
