const multer = require('multer');
const moment = require('moment');
const express = require('express');
const router = express.Router();

const { uploadCsv,getBalance } = require('../controllers/tradeControllers');

const storage = multer.diskStorage({
destination: (req, file, cb) => {
    cb(null, "./uploads");
},
filename: (req, file, cb) => {
    cb(null, file.originalname);
},
});

const upload = multer({
    storage,
})


router.route('/upload').post(upload.single('csvFile'), uploadCsv)

router.route('/getbalance').post(getBalance);

module.exports = router;