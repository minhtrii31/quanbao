const AUTH_COOKIE_NAME = 'quanbao_admin_token';
const { AUTH_TOKEN_MAX_AGE_MS } = require('./authToken');

const parseCookies = (cookieHeader = '') => {
  return cookieHeader.split(';').reduce((cookies, cookie) => {
    const [rawName, ...rest] = cookie.trim().split('=');
    if (!rawName) return cookies;
    cookies[rawName] = decodeURIComponent(rest.join('='));
    return cookies;
  }, {});
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path: '/',
  maxAge: AUTH_TOKEN_MAX_AGE_MS,
});

module.exports = {
  AUTH_COOKIE_NAME,
  parseCookies,
  getCookieOptions,
};
