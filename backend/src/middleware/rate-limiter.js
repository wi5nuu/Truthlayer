const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.headers['x-user-tier'] === 'pro') {
      return parseInt(process.env.RATE_LIMIT_PRO, 10) || 600;
    }
    return parseInt(process.env.RATE_LIMIT_FREE, 10) || 60;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Rate limit exceeded. Please wait before making another request.',
    retryAfter: 60
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

module.exports = { rateLimiter };
