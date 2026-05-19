const jwt = require('jsonwebtoken');

const AUTH_TOKEN_EXPIRES_IN = '24h';
const AUTH_TOKEN_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const AUTH_TOKEN_ALGORITHM = 'HS256';

const getUserTokenVersion = (user) => {
  if (!Number.isInteger(user?.tokenVersion)) {
    return 0;
  }

  return user.tokenVersion;
};

const signAuthToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      tokenVersion: getUserTokenVersion(user),
    },
    process.env.JWT_SECRET,
    {
      algorithm: AUTH_TOKEN_ALGORITHM,
      expiresIn: AUTH_TOKEN_EXPIRES_IN,
    }
  );
};

const verifyAuthToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: [AUTH_TOKEN_ALGORITHM],
  });
};

const isAuthTokenCurrent = (decodedToken, user) => {
  const userTokenVersion = getUserTokenVersion(user);

  if (!Number.isInteger(decodedToken?.tokenVersion)) {
    return userTokenVersion === 0;
  }

  return decodedToken.tokenVersion === userTokenVersion;
};

module.exports = {
  AUTH_TOKEN_EXPIRES_IN,
  AUTH_TOKEN_MAX_AGE_MS,
  signAuthToken,
  verifyAuthToken,
  isAuthTokenCurrent,
};
