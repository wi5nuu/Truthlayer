require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { errorHandler } = require('./middleware/error-handler');

const analyzeRoutes = require('./routes/analyze');
const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/report');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*') || (origin && origin.startsWith('chrome-extension://'))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400
}));

app.use(express.json({ limit: '50kb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.headers['x-user-tier'] === 'pro') {
      return parseInt(process.env.RATE_LIMIT_PRO, 10) || 600;
    }
    return parseInt(process.env.RATE_LIMIT_FREE, 10) || 60;
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Rate limit exceeded', retryAfter: 60 }
});
app.use(globalLimiter);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0'
  });
});

app.use('/api/v1/analyze', analyzeRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/report', reportRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Not found' });
});

app.use(errorHandler);

module.exports = app;
