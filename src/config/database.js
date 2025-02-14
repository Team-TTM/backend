const { Client } = require('pg');
const path = require("path");
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });


const client = new Client({
    user: process.env.POSTGRESQL_USER,
    host: process.env.POSTGRESQL_URL,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: process.env.POSTGRESQL_PORT
});

client.connect()
    .then(() => console.log("✅ Connexion établie avec PostgreSQL"))
    .catch(err => {
        console.error("❌ Erreur de connexion à PostgreSQL", err);
        process.exit(1); // Quitte l'application en cas d'échec
    });

module.exports = client;
