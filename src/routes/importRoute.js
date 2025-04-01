const express = require('express');
const router = express.Router();
const {authenticateJWT, authenticateDirigeant} = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const {importAdherent} = require('../controllers/importController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.resolve(__dirname, '../../data');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now().toString() + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    // eslint-disable-next-line consistent-return
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.xlsx' && ext !== '.xls') {
            return cb(new Error('Only Excel files are allowed'));
        }
        cb(null, true);
    }
});
router.post('/adherent', authenticateJWT, authenticateDirigeant, upload.single('excel'), importAdherent);

module.exports = router;