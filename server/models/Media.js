const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
    unique: true,
  },
  alt: {
    type: String,
    default: '',
  },
  folder: {
    type: String,
    default: 'quanbao',
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

mediaSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Media', mediaSchema);
