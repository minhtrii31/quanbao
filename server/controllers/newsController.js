const News = require('../models/News');
const mongoose = require('mongoose');
const { buildSearchQuery, buildSort, formatPagination, parsePagination } = require('../utils/adminListQuery');
const { SanitizationError, sanitizeImageUrl, sanitizeTiptapContent } = require('../utils/sanitizeContent');
const { publicationStatuses, validateNewsPayload } = require('../validation/cmsSchemas');
const { slug: validateSlug } = require('../validation/schema');
const { DuplicateSlugError, assertSlugAvailable, generateUniqueSlug } = require('../utils/uniqueSlug');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeNewsPayload = (body) => {
  const { payload } = validateNewsPayload(body, { partial: true });

  if (Object.prototype.hasOwnProperty.call(payload, 'image')) {
    payload.image = sanitizeImageUrl(payload.image, 'image');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'content')) {
    payload.content = sanitizeTiptapContent(payload.content);
  }

  if (payload.slug === '') {
    delete payload.slug;
  }

  return payload;
};

// Get all news (public)
exports.getNews = async (req, res) => {
  try {
    const { page = 1, limit = 10, category } = req.query;

    let query = { status: 'published' };
    if (category) query.category = category;

    const news = await News.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await News.countDocuments(query);

    res.json({
      success: true,
      news,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single news by slug
exports.getNewsBySlug = async (req, res) => {
  if (validateSlug(req.params.slug)) {
    return res.status(400).json({ success: false, message: 'Invalid news slug' });
  }

  try {
    const news = await News.findOne({ slug: req.params.slug, status: 'published' });

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create news (admin)
exports.createNews = async (req, res) => {
  const validation = validateNewsPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const payload = sanitizeNewsPayload(validation.payload);
    if (payload.slug) {
      await assertSlugAvailable(News, payload.slug, 'News');
    } else {
      payload.slug = await generateUniqueSlug(News, payload.title, { fallback: 'news' });
    }

    const news = new News(payload);
    await news.save();
    res.status(201).json({ success: true, news });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    const status = error instanceof DuplicateSlugError || error.code === 11000 ? 409 : 500;
    res.status(status).json({ success: false, message: status === 409 ? 'News slug already exists' : 'Server error' });
  }
};

// Get single news by ID (admin)
exports.getNewsById = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid news id' });
  }

  try {
    const news = await News.findById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, news });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update news (admin)
exports.updateNews = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid news id' });
  }

  const validation = validateNewsPayload(req.body, { partial: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const payload = sanitizeNewsPayload(validation.payload);
    if (payload.slug) {
      await assertSlugAvailable(News, payload.slug, 'News', req.params.id);
    }

    const news = await News.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, news });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    const status = error instanceof DuplicateSlugError || error.code === 11000 ? 409 : 500;
    res.status(status).json({ success: false, message: status === 409 ? 'News slug already exists' : 'Server error' });
  }
};

// Delete news (admin)
exports.deleteNews = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid news id' });
  }

  try {
    const news = await News.findByIdAndDelete(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }

    res.json({ success: true, message: 'News deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all news (admin)
exports.getAllNews = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, { limit: 10 });
    const query = {
      ...buildSearchQuery(req.query.search, ['title', 'category', 'excerpt', 'slug']),
    };

    if (req.query.status) {
      if (!publicationStatuses.includes(req.query.status)) {
        return res.status(400).json({ success: false, message: 'Invalid news status' });
      }
      query.status = req.query.status;
    }

    if (req.query.category) query.category = req.query.category;

    const sort = buildSort(req.query, ['title', 'category', 'status', 'createdAt', 'date'], { createdAt: -1 });
    const [news, total, counts] = await Promise.all([
      News.find(query).sort(sort).skip(skip).limit(limit),
      News.countDocuments(query),
      News.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);

    const summary = counts.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        acc.all += item.count;
        return acc;
      },
      { all: 0, published: 0, draft: 0 },
    );

    res.json({ success: true, news, ...formatPagination({ page, limit, total }), counts: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
