/**
 * Configuration de la base de données MySQL.
 * Utilise les variables d'environnement pour les paramètres de connexion.
 */

const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, '../../.env')});

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;
