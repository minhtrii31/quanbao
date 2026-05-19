const mongoose = require('mongoose');
const slugify = require('./slugify');

class DuplicateSlugError extends Error {
  constructor(resource) {
    super(`${resource} slug already exists`);
    this.name = 'DuplicateSlugError';
    this.statusCode = 409;
  }
}

const normalizeSlug = (value, fallback) => slugify(value) || fallback;

const buildSlugQuery = (slug, excludeId) => {
  const query = { slug };
  if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
    query._id = { $ne: excludeId };
  }
  return query;
};

const assertSlugAvailable = async (Model, slug, resource, excludeId) => {
  const existing = await Model.exists(buildSlugQuery(slug, excludeId));
  if (existing) throw new DuplicateSlugError(resource);
};

const generateUniqueSlug = async (Model, value, { fallback = 'item', excludeId } = {}) => {
  const baseSlug = normalizeSlug(value, fallback);
  let candidate = baseSlug;
  let suffix = 2;

  while (await Model.exists(buildSlugQuery(candidate, excludeId))) {
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return candidate;
};

module.exports = {
  DuplicateSlugError,
  assertSlugAvailable,
  generateUniqueSlug,
};
