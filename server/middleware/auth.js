const User = require('../models/User');
const { AUTH_COOKIE_NAME, parseCookies } = require('../utils/cookies');
const { isAuthTokenCurrent, verifyAuthToken } = require('../utils/authToken');

const auth = async (req, res, next) => {
  try {
    const cookies = parseCookies(req.headers.cookie);
    const cookieToken = cookies[AUTH_COOKIE_NAME];
    const headerToken = req.header('Authorization')?.replace('Bearer ', '');
    const allowHeaderFallback = process.env.NODE_ENV !== 'production' || process.env.ALLOW_AUTH_HEADER === 'true';
    const token = cookieToken || (allowHeaderFallback ? headerToken : null);

    if (!token) {
      return res.status(401).json({ success: false, message: 'No token provided, authorization denied' });
    }

    const decoded = verifyAuthToken(token);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user || !isAuthTokenCurrent(decoded, user)) {
      return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token is not valid' });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }

  next();
};

module.exports = auth;
module.exports.requireAdmin = requireAdmin;
