const {importerXlsx} = require('../services/adherantService');
const path = require('path');

async function importDatabse() {
    try {
        await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_DEV));

    } catch (err) {
        console.error('❌ Erreur de imporation à MySQL:', err);
        process.exit(1);
    }
}

importDatabse();