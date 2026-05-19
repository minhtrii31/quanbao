const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const streamifier = require('streamifier');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage
const storage = multer.memoryStorage();
const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const allowedImageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
const allowedFolders = ['quanbao', 'news', 'projects', 'services', 'pages', 'media', 'editor'];

const isAllowedFolder = (folder) => allowedFolders.includes(folder);

const detectImageType = (buffer) => {
  if (!Buffer.isBuffer(buffer)) return null;

  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return { mimeType: 'image/jpeg', extension: 'jpg' };
  }

  if (
    buffer.length >= 8
    && buffer[0] === 0x89
    && buffer[1] === 0x50
    && buffer[2] === 0x4e
    && buffer[3] === 0x47
    && buffer[4] === 0x0d
    && buffer[5] === 0x0a
    && buffer[6] === 0x1a
    && buffer[7] === 0x0a
  ) {
    return { mimeType: 'image/png', extension: 'png' };
  }

  if (buffer.length >= 6) {
    const gifSignature = buffer.subarray(0, 6).toString('ascii');
    if (gifSignature === 'GIF87a' || gifSignature === 'GIF89a') {
      return { mimeType: 'image/gif', extension: 'gif' };
    }
  }

  if (
    buffer.length >= 12
    && buffer.subarray(0, 4).toString('ascii') === 'RIFF'
    && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return { mimeType: 'image/webp', extension: 'webp' };
  }

  return null;
};

const validateUploadedImage = (file) => {
  const detectedType = detectImageType(file?.buffer);

  if (!detectedType || !allowedImageTypes.includes(detectedType.mimeType)) {
    return { valid: false, message: 'Invalid file type. Only images are allowed.' };
  }

  return { valid: true, ...detectedType };
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'image'));
    }
    cb(null, true);
  },
});

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'quanbao') => {
  if (!isAllowedFolder(folder)) {
    return Promise.reject(new Error('Invalid upload folder'));
  }

  const detectedType = detectImageType(buffer);
  if (!detectedType || !allowedImageTypes.includes(detectedType.mimeType)) {
    return Promise.reject(new Error('Invalid file type. Only images are allowed.'));
  }

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        allowed_formats: allowedImageExtensions,
        transformation: [{ width: 1200, height: 800, crop: 'limit' }]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = {
  allowedImageTypes,
  allowedFolders,
  cloudinary,
  detectImageType,
  isAllowedFolder,
  upload,
  uploadToCloudinary,
  validateUploadedImage,
};
