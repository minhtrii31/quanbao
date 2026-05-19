const express = require('express');
const statsController = require('../controllers/statsController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware for admin
router.use(auth);
router.use(requireAdmin);

// Get dashboard statistics
router.get('/', statsController.getStats);

module.exports = router;
