const express = require('express');
const contactController = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimit');

const router = express.Router();

// Public route
router.post('/', contactLimiter, contactController.submitContact);

module.exports = router;