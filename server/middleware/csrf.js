const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);
const COOKIE_AUTH_MUTATION_PREFIXES = ['/api/admin', '/api/upload', '/api/auth/logout'];

const parseOrigin = (value) => {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch (error) {
    return null;
  }
};

const getRequestSelfOrigin = (req) => {
  const host = req.get('host');
  if (!host) return null;

  const forwardedProto = req.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const proto = forwardedProto || req.protocol || (req.secure ? 'https' : 'http');
  return `${proto}://${host}`;
};

const getAllowedOrigins = (req) => {
  const origins = new Set([
    parseOrigin(process.env.CLIENT_URL),
    parseOrigin(process.env.API_PUBLIC_URL),
    parseOrigin(getRequestSelfOrigin(req)),
  ].filter(Boolean));

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
    origins.add('http://localhost:3001');
    origins.add('http://127.0.0.1:3001');
    origins.add('http://localhost:5000');
    origins.add('http://127.0.0.1:5000');
  }

  return origins;
};

const getSubmittedOrigin = (req) => (
  parseOrigin(req.get('origin')) || parseOrigin(req.get('referer'))
);

const validateUnsafeRequestOrigin = (req, res, next) => {
  if (!UNSAFE_METHODS.has(req.method)) {
    return next();
  }

  const submittedOrigin = getSubmittedOrigin(req);
  if (!submittedOrigin) {
    if (process.env.NODE_ENV !== 'production') {
      return next();
    }

    return res.status(403).json({ success: false, message: 'Invalid request origin' });
  }

  if (!getAllowedOrigins(req).has(submittedOrigin)) {
    return res.status(403).json({ success: false, message: 'Invalid request origin' });
  }

  next();
};

module.exports = {
  COOKIE_AUTH_MUTATION_PREFIXES,
  getAllowedOrigins,
  getSubmittedOrigin,
  validateUnsafeRequestOrigin,
};
