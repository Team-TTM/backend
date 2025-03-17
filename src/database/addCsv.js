const {importerXlsx} = require('../services/adherantService');
const path = require('path');

await importerXlsx(path.resolve(__dirname, '../../data', process.env.XLSX_FILE2024));