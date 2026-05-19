const mongoose = require('mongoose');
const { cloudinary, uploadToCloudinary, validateUploadedImage } = require('../config/cloudinary');
const Media = require('../models/Media');
const { validateMediaMetadata, validateMediaUploadBody } = require('../validation/cmsSchemas');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Upload image to Cloudinary
exports.uploadImage = async (req, res) => {
  let uploadedPublicId;
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageValidation = validateUploadedImage(req.file);
    if (!imageValidation.valid) return res.status(400).json({ success: false, message: imageValidation.message });

    const bodyValidation = validateMediaUploadBody({ alt: req.body.alt }, { partial: true });
    if (!bodyValidation.valid) {
      return res.status(400).json({ success: false, message: bodyValidation.message });
    }

    // Upload to Cloudinary using buffer
    const result = await uploadToCloudinary(req.file.buffer);
    uploadedPublicId = result.public_id;
    const metadataValidation = validateMediaMetadata({
      url: result.secure_url,
      publicId: result.public_id,
      alt: bodyValidation.payload.alt || '',
      folder: 'quanbao',
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
    req.auditResourceId = media._id;

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      message: 'Image uploaded successfully'
    });
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId).catch(() => undefined);
    }
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

// Delete image from Cloudinary and media library
exports.deleteImage = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid media id' });
  }

  try {
    const media = await Media.findById(req.params.id);

    if (!media) return res.status(404).json({ success: false, message: 'Media not found' });

    await cloudinary.uploader.destroy(media.publicId);
    await media.deleteOne();
    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
