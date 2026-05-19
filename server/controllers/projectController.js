const Project = require('../models/Project');
const mongoose = require('mongoose');
const { buildSearchQuery, buildSort, formatPagination, parsePagination } = require('../utils/adminListQuery');
const { SanitizationError, sanitizeImageUrl, sanitizeOptionalLinkHref, sanitizeTiptapContent } = require('../utils/sanitizeContent');
const { publicationStatuses, validateProjectPayload } = require('../validation/cmsSchemas');
const { slug: validateSlug } = require('../validation/schema');
const { DuplicateSlugError, assertSlugAvailable, generateUniqueSlug } = require('../utils/uniqueSlug');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const sanitizeProjectPayload = (body) => {
  const { payload } = validateProjectPayload(body, { partial: true });

  if (Object.prototype.hasOwnProperty.call(payload, 'image')) {
    payload.image = sanitizeImageUrl(payload.image, 'image');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'link')) {
    payload.link = sanitizeOptionalLinkHref(payload.link, 'project link');
  }

  if (Object.prototype.hasOwnProperty.call(payload, 'content')) {
    payload.content = sanitizeTiptapContent(payload.content);
  }

  if (payload.slug === '') {
    delete payload.slug;
  }

  return payload;
};

// Get all projects (public)
exports.getProjects = async (req, res) => {
  try {
    const { category } = req.query;
    const hasPagination = req.query.page !== undefined || req.query.limit !== undefined;

    let query = { status: 'published' };
    if (category) query.category = category;

    const sort = { createdAt: -1 };

    if (!hasPagination) {
      const projects = await Project.find(query).sort(sort);
      return res.json({ success: true, projects });
    }

    const { page, limit, skip } = parsePagination(req.query, { limit: 9, maxLimit: 24 });
    const [projects, total] = await Promise.all([
      Project.find(query).sort(sort).skip(skip).limit(limit),
      Project.countDocuments(query),
    ]);

    res.json({ success: true, projects, ...formatPagination({ page, limit, total }) });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single project by slug or legacy ObjectId
exports.getProject = async (req, res) => {
  const { identifier } = req.params;
  const isObjectId = isValidObjectId(identifier);
  const isSlug = !validateSlug(identifier);

  if (!isObjectId && !isSlug) {
    return res.status(400).json({ success: false, message: 'Invalid project identifier' });
  }

  try {
    let project = null;
    if (isObjectId) {
      project = await Project.findOne({ _id: identifier, status: 'published' });
    }
    if (!project && isSlug) {
      project = await Project.findOne({ slug: identifier, status: 'published' });
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get single project (admin)
exports.getAdminProject = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid project id' });
  }

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Create project (admin)
exports.createProject = async (req, res) => {
  const validation = validateProjectPayload(req.body);
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const payload = sanitizeProjectPayload(validation.payload);
    if (payload.slug) {
      await assertSlugAvailable(Project, payload.slug, 'Project');
    } else {
      payload.slug = await generateUniqueSlug(Project, payload.title, { fallback: 'project' });
    }

    const project = new Project(payload);
    await project.save();
    res.status(201).json({ success: true, project });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    const status = error instanceof DuplicateSlugError || error.code === 11000 ? 409 : 500;
    res.status(status).json({ success: false, message: status === 409 ? 'Project slug already exists' : 'Server error' });
  }
};

// Update project (admin)
exports.updateProject = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid project id' });
  }

  const validation = validateProjectPayload(req.body, { partial: true });
  if (!validation.valid) {
    return res.status(400).json({ success: false, message: validation.message });
  }

  try {
    const payload = sanitizeProjectPayload(validation.payload);
    if (payload.slug) {
      await assertSlugAvailable(Project, payload.slug, 'Project', req.params.id);
    }

    const project = await Project.findByIdAndUpdate(req.params.id, payload, { new: true, runValidators: true });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    if (error instanceof SanitizationError) {
      return res.status(error.statusCode).json({ success: false, message: error.message });
    }

    const status = error instanceof DuplicateSlugError || error.code === 11000 ? 409 : 500;
    res.status(status).json({ success: false, message: status === 409 ? 'Project slug already exists' : 'Server error' });
  }
};

// Delete project (admin)
exports.deleteProject = async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: 'Invalid project id' });
  }

  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get all projects (admin)
exports.getAllProjects = async (req, res) => {
  try {
    const { page, limit, skip } = parsePagination(req.query, { limit: 10 });
    const query = {
      ...buildSearchQuery(req.query.search, ['title', 'category', 'description', 'client', 'slug']),
    };

    if (req.query.status) {
      if (!publicationStatuses.includes(req.query.status)) {
        return res.status(400).json({ success: false, message: 'Invalid project status' });
      }
      query.status = req.query.status;
    }

    if (req.query.category) query.category = req.query.category;

    const sort = buildSort(req.query, ['title', 'category', 'status', 'createdAt'], { createdAt: -1 });
    const [projects, total, counts, categoryCount] = await Promise.all([
      Project.find(query).sort(sort).skip(skip).limit(limit),
      Project.countDocuments(query),
      Project.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Project.distinct('category'),
    ]);

    const summary = counts.reduce(
      (acc, item) => {
        acc[item._id] = item.count;
        acc.all += item.count;
        return acc;
      },
      { all: 0, published: 0, draft: 0, categories: categoryCount.length },
    );

    res.json({ success: true, projects, ...formatPagination({ page, limit, total }), counts: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
