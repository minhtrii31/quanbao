const mongoose = require('mongoose');
const Media = require('../models/Media');
const { cloudinary, isAllowedFolder, uploadToCloudinary, validateUploadedImage } = require('../config/cloudinary');
const { buildSearchQuery, buildSort, formatPagination, parsePagination } = require('../utils/adminListQuery');
const {
  validateMediaMetadata,
  validateMediaUpdatePayload,
  validateMediaUploadBody,
} = require('../validation/cmsSchemas');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

exports.getMedia = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, { limit: 12 });
    const query = {
      ...buildSearchQuery(req.query.search, ['alt', 'folder', 'publicId', 'mimeType']),
    };

    if (req.query.folder) query.folder = req.query.folder;

    const sort = buildSort(req.query, ['alt', 'folder', 'mimeType', 'size', 'createdAt'], { createdAt: -1 });
    const [media, total] = await Promise.all([
      Media.find(query).sort(sort).skip(skip).limit(limit),
      Media.countDocuments(query),
    ]);

    res.json({ success: true, media, ...formatPagination({ page, limit, total }) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadMedia = async (req, res) => {
  let uploadedPublicId;
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const imageValidation = validateUploadedImage(req.file);
    if (!imageValidation.valid) return res.status(400).json({ success: false, message: imageValidation.message });

    const folder = req.body.folder || 'quanbao';
    if (!isAllowedFolder(folder)) return res.status(400).json({ success: false, message: 'Invalid upload folder' });

    const bodyValidation = validateMediaUploadBody({ ...req.body, folder }, { partial: true });
    if (!bodyValidation.valid) return res.status(400).json({ success: false, message: bodyValidation.message });

    const result = await uploadToCloudinary(req.file.buffer, folder);
    uploadedPublicId = result.public_id;
    const metadataValidation = validateMediaMetadata({
      url: result.secure_url,
      publicId: result.public_id,
      alt: bodyValidation.payload.alt || '',
      folder,
      mimeType: imageValidation.mimeType,
      size: req.file.size,
    });
    if (!metadataValidation.valid) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => undefined);
      uploadedPublicId = undefined;
      return res.status(400).json({ success: false, message: metadataValidation.message });
    }

    const media = await Media.create({
      ...metadataValidation.payload,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, media, url: media.url, public_id: media.publicId });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => undefined);
    }
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

exports.updateMedia = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid media id' });
  const validation = validateMediaUpdatePayload(req.body, { partial: true });
  if (!validation.valid) return res.status(400).json({ success: false, message: validation.message });

  try {
    const media = await Media.findByIdAndUpdate(req.params.id, { alt: validation.payload.alt || '' }, { new: true, runValidators: true });
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    res.json({ success: true, media });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteMedia = async (req, res) => {
  if (!isValidObjectId(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid media id' });
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });
    await cloudinary.uploader.destroy(media.publicId);
    await media.deleteOne();
    res.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
