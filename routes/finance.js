var express = require('express');
const multer = require('multer');
const Finance = require('../helpers/finance');
const CONFIG = require('../config');
var router = express.Router();

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Verificar la extensión del archivo
    if (!file.originalname.match(/\.(xls|xlsx)$/)) {
        return cb(new Error('Solo se permiten archivos .xls o .xlsx'), false);
    }
    cb(null, true);
};

const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * CONFIG.FILES.MAX_SIZE // Límite de 2MB
    }
});

router.post('/generate', upload.single('file'), async (req, res) => {
    if(req.file){
        res.json(Finance.processFinanceFile(req.file));
    }
    res.json({status: 400, error: 'Not file attached.'})
})

module.exports = router;