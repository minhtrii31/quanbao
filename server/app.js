const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const { getContentSecurityPolicy } = require('./utils/csp');
const { getLiveness, getReadiness } = require('./utils/health');
const {
  COOKIE_AUTH_MUTATION_PREFIXES,
  validateUnsafeRequestOrigin,
} = require('./middleware/csrf');
const { requestContext, requestLogger } = require('./middleware/requestLogging');

const app = express();
const errorHandler = require('./middleware/errorHandler');
const helmetOptions = {
  contentSecurityPolicy: getContentSecurityPolicy(),
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: false,
  frameguard: { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
};

// Connect to database
if (process.env.DISABLE_DB_CONNECT !== 'true') {
  connectDB();
}

// Middleware
app.locals.helmetOptions = helmetOptions;
app.use(requestContext);
app.use(helmet(helmetOptions));
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: process.env.JSON_BODY_LIMIT || '1mb' }));
app.use(express.urlencoded({ extended: true, limit: process.env.URLENCODED_BODY_LIMIT || '1mb' }));
app.use(requestLogger);
app.use(COOKIE_AUTH_MUTATION_PREFIXES, validateUnsafeRequestOrigin);

// Routes
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Quan Bao API is running' });
});

app.get('/health', (req, res) => {
  res.json(getLiveness());
});

app.get('/ready', (req, res) => {
  const readiness = getReadiness();
  res.status(readiness.httpStatus).json(readiness.body);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/news', require('./routes/news'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/services', require('./routes/services'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/stats', require('./routes/stats'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
