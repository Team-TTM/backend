const { MongoClient } = require('mongodb');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });



const client = new MongoClient(process.env.MONGO_DB_URL);

async function connectToDb() {
    try {
        await client.connect();
        console.log('Connexion établie avec MongoDB');
        return client.db(process.env.MONG0_DB_NAME);
    } catch (err) {
        console.error('Erreur de connexion à MongoDB', err);
        process.exit(1);
    }
}

module.exports = connectToDb;