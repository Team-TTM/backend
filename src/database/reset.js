const {initDatabase, dropAllTables} = require('./databaseSetup');


dropAllTables().then(() => {
    console.log('Suppression des table terminé');
    initDatabase()
        .then(() => console.log('✅ Initialisation terminée'))
        .catch(err => console.error('❌ Erreur lors de l\'initialisation :', err));
});
