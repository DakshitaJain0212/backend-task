const express = require('express');
const { sendEmail } = require('../controllers/EmailController');
const router = express.Router();
const rateLimiter = require('../utils/rateLimiter');

router.post('/send', rateLimiter, sendEmail);

module.exports = router;
