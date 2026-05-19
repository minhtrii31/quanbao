const requiredBaseEnv = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_URL', 'API_PUBLIC_URL'];
const cloudinaryEnv = ['CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_API_SECRET'];
const localHostnames = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

const isProduction = () => process.env.NODE_ENV === 'production';

const parseUrl = (key) => {
  const value = process.env[key];
  if (!value) return null;

  try {
    return new URL(value);
  } catch {
    throw new Error(`${key} must be a valid URL`);
  }
};

const isLocalHostname = (hostname) => localHostnames.has(hostname);

const validateProductionOrigin = (key) => {
  const url = parseUrl(key);
  if (!url) return;

  if (url.protocol !== 'https:') {
    throw new Error(`${key} must use https in production`);
  }

  if (isLocalHostname(url.hostname)) {
    throw new Error(`${key} must not use localhost in production`);
  }

  if (process.env[key] !== url.origin) {
    throw new Error(`${key} must be an exact origin with no path, query, hash, or trailing slash`);
  }
};

const validateApiUrlAlignment = () => {
  const apiPublicUrl = parseUrl('API_PUBLIC_URL');
  const apiUrl = parseUrl('API_URL');

  if (apiUrl && apiPublicUrl && apiUrl.origin !== apiPublicUrl.origin) {
    throw new Error('API_URL must use the same origin as API_PUBLIC_URL when both are set');
  }
};

const getProductionEnvReadiness = () => {
  const mode = process.env.NODE_ENV || 'development';

  if (!isProduction()) {
    return {
      status: 'skipped',
      mode,
      required: [],
      missing: [],
      invalid: [],
    };
  }

  const required = [...requiredBaseEnv];
  const uploadEnabled = process.env.CLOUDINARY_ENABLED !== 'false';
  if (uploadEnabled) required.push(...cloudinaryEnv);

  const missing = required.filter((key) => !process.env[key]);
  const invalid = [];

  for (const key of ['CLIENT_URL', 'API_PUBLIC_URL']) {
    if (!process.env[key]) continue;

    try {
      validateProductionOrigin(key);
    } catch (error) {
      invalid.push({ key, message: error.message });
    }
  }

  if (process.env.API_URL && process.env.API_PUBLIC_URL) {
    try {
      validateApiUrlAlignment();
    } catch (error) {
      invalid.push({ key: 'API_URL', message: error.message });
    }
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    invalid.push({ key: 'JWT_SECRET', message: 'JWT_SECRET must be at least 32 characters' });
  }

  return {
    status: missing.length > 0 || invalid.length > 0 ? 'failed' : 'ok',
    mode,
    required,
    missing,
    invalid,
  };
};

const validateEnv = () => {
  const readiness = getProductionEnvReadiness();

  if (readiness.missing.length > 0) {
    throw new Error(`Missing required environment variables: ${readiness.missing.join(', ')}`);
  }

  if (readiness.invalid.length > 0) {
    throw new Error(readiness.invalid[0].message);
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
  }
};

module.exports = {
  getProductionEnvReadiness,
  isProduction,
  validateEnv,
  validateProductionOrigin,
};
