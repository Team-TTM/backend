// Pour créer un serveur HTTP
const http = require('http');
// Pour lire les fichiers du système
const fs = require('fs');
// Pour manipuler les chemins de fichiers
const path = require('path');

// Création du serveur
const server = http.createServer((req, res) => {
    let filePath = path.join(__dirname, 'dist', req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);

    // Définir le type de contenu selon l'extension
    let contentType = 'text/html';

    // Lire et servir le fichier demandé
    fs.readFile(filePath, (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // Fichier non trouvé
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 : Fichier non trouvé');
            } else {
                // Erreur serveur
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Erreur interne du serveur');
            }
        } else {
            // Fichier trouvé, l'envoyer avec le bon Content-Type
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

// Lancer le serveur
server.listen(process.env.PORT || 3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
});