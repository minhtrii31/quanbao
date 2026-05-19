const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const seoSchema = new mongoose.Schema({
  title: String,
  description: String,
  ogImage: String,
}, { _id: false });

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  detail: {
    type: String,
    default: '',
  },
  features: {
    type: [String],
    default: [],
  },
  includes: {
    type: [String],
    default: [],
  },
  process: {
    type: [String],
    default: [],
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'published',
  },
  order: {
    type: Number,
    default: 0,
  },
  seo: {
    type: seoSchema,
    default: {},
  },
}, {
  timestamps: true,
});

serviceSchema.pre('save', function(next) {
  if (this.isModified('title') || !this.slug) {
    this.slug = slugify(this.slug || this.title);
  }
  next();
});

serviceSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update && (update.title || update.slug)) {
    update.slug = slugify(update.slug || update.title);
    this.setUpdate(update);
  }
  next();
});

serviceSchema.index({ status: 1, order: 1 });

module.exports = mongoose.model('Service', serviceSchema);
