const crypto = require('crypto');
const logger = require('../utils/logger');

const getRequestId = (req) => {
  const incoming = req.get('x-request-id');
  if (incoming && incoming.length <= 128) return incoming;
  return crypto.randomUUID();
};

const requestContext = (req, res, next) => {
  req.id = getRequestId(req);
  res.setHeader('X-Request-Id', req.id);
  next();
};

const requestLogger = (req, res, next) => {
  const started = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - started) / 1e6;
    logger.info('http_request', {
      requestId: req.id,
      method: req.method,
      path: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      ip: req.ip,
      userAgent: req.get('user-agent') || '',
      actorId: req.user?._id?.toString(),
    });
  });

  next();
};

module.exports = {
  requestContext,
  requestLogger,
};
