const rateLimit = require('express-rate-limit');
const { rateLimit: configRateLimit } = require('../config/config');

const limiter = rateLimit({
  windowMs: configRateLimit.windowMs,
  max: configRateLimit.max,
  message: 'Too many requests from this IP, please try again later.'
});

module.exports = limiter;
