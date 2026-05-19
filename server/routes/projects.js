const express = require('express');
const projectController = require('../controllers/projectController');

const router = express.Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:identifier', projectController.getProject);

module.exports = router;
