const {initDatabase, dropAllTables,} = require('./databaseSetup');
const pool = require('../config/database');



async function main() {
    try {
        await dropAllTables();
        console.log('Suppression des tables terminée.');

        await initDatabase();
        console.log('✅ Initialisation terminée.');

        pool.end((err) => {
            if (err) {
                console.error('❌ Erreur lors de la fermeture de la pool:', err);
            } else {
                console.log('Pool fermée avec succès.');
            }
        });
    } catch (err) {
        console.error('❌ Une erreur est survenue :', err);
    }
}

main();