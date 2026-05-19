const express = require('express');
const newsController = require('../controllers/newsController');

const router = express.Router();

// Public routes
router.get('/', newsController.getNews);
router.get('/:slug', newsController.getNewsBySlug);

module.exports = router;