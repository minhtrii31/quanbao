const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  // Support both HTML string and JSON content (for rich text editors)
  content: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  }
}, {
  timestamps: true
});

newsSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = require('../utils/slugify')(this.title);
  }
  next();
});

// Index for search
newsSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('News', newsSchema);
