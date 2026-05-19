const rateLimit = require('express-rate-limit');

const FIFTEEN_MINUTES = 15 * 60 * 1000;

const rateLimitConfig = {
  auth: {
    windowMs: FIFTEEN_MINUTES,
    max: 5,
    message: { success: false, message: 'Too many login attempts, please try again later' },
  },
  contact: {
    windowMs: FIFTEEN_MINUTES,
    max: 10,
    message: { success: false, message: 'Too many contact submissions, please try again later' },
  },
  adminMutation: {
    windowMs: FIFTEEN_MINUTES,
    max: 180,
    message: { success: false, message: 'Too many admin changes, please try again later' },
  },
  adminUpload: {
    windowMs: FIFTEEN_MINUTES,
    max: 60,
    message: { success: false, message: 'Too many admin uploads, please try again later' },
  },
};

const authLimiter = rateLimit({
  ...rateLimitConfig.auth,
});

const contactLimiter = rateLimit({
  ...rateLimitConfig.contact,
});

const adminMutationLimiter = rateLimit({
  ...rateLimitConfig.adminMutation,
});

const adminUploadLimiter = rateLimit({
  ...rateLimitConfig.adminUpload,
});

module.exports = {
  rateLimitConfig,
  authLimiter,
  contactLimiter,
  adminMutationLimiter,
  adminUploadLimiter,
};
