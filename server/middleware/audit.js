const AuditLog = require('../models/AuditLog');
const { AUTH_COOKIE_NAME, parseCookies } = require('../utils/cookies');
const { verifyAuthToken } = require('../utils/authToken');
const logger = require('../utils/logger');

const getValue = (source, path) => {
  if (!source || !path) return undefined;
  return path.split('.').reduce((value, key) => value?.[key], source);
};

const getActorId = (req, body, actorPath) => {
  const actor = req.user?._id || req.user?.id || req.auditActorId || getValue(body, actorPath);
  if (actor) return actor.toString();

  try {
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies[AUTH_COOKIE_NAME];
    if (!token) return undefined;
    return verifyAuthToken(token).userId;
  } catch (error) {
    return undefined;
  }
};

const getResourceId = (req, body, resourceIdPath) => {
  const resourceId = req.auditResourceId || req.params.id || getValue(body, resourceIdPath);
  return resourceId ? resourceId.toString() : undefined;
};

const auditAction = ({ action, resourceType, resourceIdPath, actorPath = 'user._id' }) => (req, res, next) => {
  let responseBody;
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    responseBody = body;
    return originalJson(body);
  };

  res.on('finish', () => {
    if (res.statusCode >= 400) return;

    const actorId = getActorId(req, responseBody, actorPath);
    const resourceId = getResourceId(req, responseBody, resourceIdPath);
    const entry = {
      actor: actorId,
      action,
      resourceType,
      resourceId,
      ip: req.ip || '',
      userAgent: req.get('user-agent') || '',
      requestId: req.id || '',
      statusCode: res.statusCode,
      timestamp: new Date(),
    };

    AuditLog.create(entry)
      .then(() => {
        logger.info('admin_audit', {
          requestId: entry.requestId,
          actorId,
          action,
          resourceType,
          resourceId,
          ip: entry.ip,
          userAgent: entry.userAgent,
          statusCode: entry.statusCode,
        });
      })
      .catch((error) => {
        logger.error('audit_log_failed', {
          requestId: entry.requestId,
          action,
          resourceType,
          message: error.message,
        });
      });
  });

  next();
};

module.exports = {
  auditAction,
};
