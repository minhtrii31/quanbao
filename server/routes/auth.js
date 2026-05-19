const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const { auditAction } = require('../middleware/audit');

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/login', authLimiter, loginValidation, auditAction({
  action: 'admin.login',
  resourceType: 'auth',
  resourceIdPath: 'user._id',
}), authController.login);
router.post('/logout', auditAction({
  action: 'admin.logout',
  resourceType: 'auth',
}), authController.logout);
router.get('/me', auth, authController.me);

module.exports = router;
