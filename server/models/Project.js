const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
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
  description: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed
  },
  link: {
    type: String
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published'
  },
  featured: {
    type: Boolean,
    default: false
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  client: {
    type: String
  }
}, {
  timestamps: true
});

// Index for category query
projectSchema.index({ category: 1 });
projectSchema.index({ featured: -1 });
projectSchema.index({ status: 1, createdAt: -1 });
projectSchema.index({ status: 1, category: 1, createdAt: -1 });

module.exports = mongoose.model('Project', projectSchema);
