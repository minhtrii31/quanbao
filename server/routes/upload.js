const express = require('express');
const { upload } = require('../config/cloudinary');
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const { adminMutationLimiter, adminUploadLimiter } = require('../middleware/rateLimit');
const { auditAction } = require('../middleware/audit');

const router = express.Router();

// Apply auth middleware
router.use(auth);
router.use(requireAdmin);

// Upload image
router.post('/', adminUploadLimiter, auditAction({ action: 'media.upload', resourceType: 'media' }), upload.single('image'), uploadController.uploadImage);

// Delete image by media document id
router.delete('/:id', adminMutationLimiter, auditAction({ action: 'media.delete', resourceType: 'media' }), uploadController.deleteImage);

module.exports = router;
