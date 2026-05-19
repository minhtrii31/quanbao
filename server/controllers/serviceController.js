const mongoose = require('mongoose');
const Service = require('../models/Service');
const { SanitizationError, sanitizeImageUrl, sanitizeOptionalImageUrl } = require('../utils/sanitizeContent');
const { validateServicePayload } = require('../validation/cmsSchemas');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeServicePayload = (body) => {
  const { payload } = validateServicePayload(body, { partial: true });

  if (Object.prototype.hasOwnProperty.call(payload, 'image')) {
    payload.image = sanitizeImageUrl(payload.image, 'image');
  }

  if (payload.seo && typeof payload.seo === 'object' && Object.prototype.hasOwnProperty.call(payload.seo, 'ogImage')) {
    payload.seo = {
      ...payload.seo,
      ogImage: sanitizeOptionalImageUrl(payload.seo.ogImage, 'seo ogImage'),
    };
  }

  return payload;
};

exports.getServices = async (req, res) => {
  try {
    const services = await Service.find({ status: 'published' }).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, status: 'published' });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getAdminService = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid service id' });
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createService = async (req, res) => {
  const validation = validateServicePayload(req.body);
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });
  try {
    const service = new Service(sanitizeServicePayload(validation.payload));
    await service.save();
    res.status(201).json({ success: true, service });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? 'Service slug already exists' : 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid service id' });
  const validation = validateServicePayload(req.body, { partial: true });
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, sanitizeServicePayload(validation.payload), { new: true, runValidators: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, service });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    res.status(error.code === 11000 ? 409 : 500).json({ success: false, message: error.code === 11000 ? 'Service slug already exists' : 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid service id' });
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.json({ success: true, message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
