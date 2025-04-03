const {importerXlsx} = require('../services/adherantService');

const importAdherent = async (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé.');
    }
    try {
        const {add, update} = await importerXlsx(req.file.path);
        return res.status(200).json({add, update});
    } catch (err) {
        return res.status(500).send({error: err.message});
    }
};

module.exports = {importAdherent};