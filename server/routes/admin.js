const express = require('express');
const auth = require('../middleware/auth');
const { requireAdmin } = require('../middleware/auth');
const newsController = require('../controllers/newsController');
const projectController = require('../controllers/projectController');
const contactController = require('../controllers/contactController');
const settingsController = require('../controllers/settingsController');
const profileController = require('../controllers/profileController');
const serviceController = require('../controllers/serviceController');
const mediaController = require('../controllers/mediaController');
const { upload } = require('../config/cloudinary');
const { adminMutationLimiter, adminUploadLimiter } = require('../middleware/rateLimit');
const { auditAction } = require('../middleware/audit');

const router = express.Router();

// Apply auth and admin middleware to all admin routes
router.use(auth);
router.use(requireAdmin);

// News CRUD (admin)
router.get('/news', newsController.getAllNews);
router.get('/news/:id', newsController.getNewsById);
router.post('/news', adminMutationLimiter, auditAction({ action: 'cms.news.create', resourceType: 'news', resourceIdPath: 'news._id' }), newsController.createNews);
router.put('/news/:id', adminMutationLimiter, auditAction({ action: 'cms.news.update', resourceType: 'news' }), newsController.updateNews);
router.delete('/news/:id', adminMutationLimiter, auditAction({ action: 'cms.news.delete', resourceType: 'news' }), newsController.deleteNews);

// Projects CRUD (admin)
router.get('/projects', projectController.getAllProjects);
router.get('/projects/:id', projectController.getAdminProject);
router.post('/projects', adminMutationLimiter, auditAction({ action: 'cms.project.create', resourceType: 'project', resourceIdPath: 'project._id' }), projectController.createProject);
router.put('/projects/:id', adminMutationLimiter, auditAction({ action: 'cms.project.update', resourceType: 'project' }), projectController.updateProject);
router.delete('/projects/:id', adminMutationLimiter, auditAction({ action: 'cms.project.delete', resourceType: 'project' }), projectController.deleteProject);

// Services CRUD (admin)
router.get('/services', serviceController.getAllServices);
router.get('/services/:id', serviceController.getAdminService);
router.post('/services', adminMutationLimiter, auditAction({ action: 'cms.service.create', resourceType: 'service', resourceIdPath: 'service._id' }), serviceController.createService);
router.put('/services/:id', adminMutationLimiter, auditAction({ action: 'cms.service.update', resourceType: 'service' }), serviceController.updateService);
router.delete('/services/:id', adminMutationLimiter, auditAction({ action: 'cms.service.delete', resourceType: 'service' }), serviceController.deleteService);

// Media library (admin)
router.get('/media', mediaController.getMedia);
router.post('/media', adminUploadLimiter, auditAction({ action: 'media.upload', resourceType: 'media', resourceIdPath: 'media._id' }), upload.single('image'), mediaController.uploadMedia);
router.put('/media/:id', adminMutationLimiter, auditAction({ action: 'media.update', resourceType: 'media' }), mediaController.updateMedia);
router.delete('/media/:id', adminMutationLimiter, auditAction({ action: 'media.delete', resourceType: 'media' }), mediaController.deleteMedia);

// Contacts (admin)
router.get('/contacts', contactController.getContacts);
router.put('/contacts/:id', adminMutationLimiter, auditAction({ action: 'cms.contact.update', resourceType: 'contact' }), contactController.updateContact);
router.delete('/contacts/:id', adminMutationLimiter, auditAction({ action: 'cms.contact.delete', resourceType: 'contact' }), contactController.deleteContact);

// Settings (admin)
router.get('/settings', settingsController.getSettings);
router.put('/settings', adminMutationLimiter, auditAction({ action: 'settings.update', resourceType: 'settings', resourceIdPath: 'settings.key' }), settingsController.updateSettings);

// Profile (admin)
router.get('/profile', profileController.getProfile);
router.put('/profile', adminMutationLimiter, auditAction({ action: 'admin.profile.update', resourceType: 'admin_profile' }), profileController.updateProfile);
router.put('/profile/password', adminMutationLimiter, auditAction({ action: 'admin.password.change', resourceType: 'admin_profile' }), profileController.changePassword);

module.exports = router;
