const {
  assertValidPayload,
  boolean,
  email,
  hasOwn,
  httpsUrl,
  internalPathOrHttpsUrl,
  isPlainObject,
  maxLength,
  nonEmptyString,
  nonNegativeNumber,
  oneOf,
  slug,
  string,
  validDate,
  validatePayload,
} = require('./schema');

const { allowedFolders, allowedImageTypes } = require('../config/cloudinary');

const publicationStatuses = ['draft', 'published'];
const contactStatuses = ['new', 'read', 'replied'];

const requiredString = (max) => ({
  required: true,
  validators: [nonEmptyString, maxLength(max)],
});

const optionalString = (max) => ({
  validators: [string, maxLength(max)],
});

const optionalHttpsUrl = {
  validators: [httpsUrl, maxLength(2048)],
};

const requiredHttpsUrl = {
  required: true,
  validators: [httpsUrl, maxLength(2048)],
};

const optionalInternalOrHttpsUrl = {
  validators: [internalPathOrHttpsUrl, maxLength(2048)],
};

const stringArray = (maxItemLength) => (value) => {
  if (!Array.isArray(value)) return 'must be an array';

  if (value.some((item) => typeof item !== 'string')) return 'must contain only strings';

  const tooLongItem = value.find((item) => item.length > maxItemLength);
  return tooLongItem === undefined ? null : `items must be at most ${maxItemLength} characters`;
};

const mixedContent = {
  required: true,
  validators: [(value) => (
    typeof value === 'string' || isPlainObject(value) ? null : 'must be rich text content'
  )],
};

const dateOrdering = (endField) => (value, body) => {
  const endValue = body[endField];
  if (!endValue) return null;

  const startDate = new Date(value);
  const endDate = new Date(endValue);
  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return null;

  return startDate <= endDate ? null : `must be before or equal to ${endField}`;
};

const newsSchema = {
  title: requiredString(180),
  category: requiredString(80),
  image: requiredHttpsUrl,
  excerpt: requiredString(500),
  content: mixedContent,
  date: { validators: [validDate] },
  slug: { validators: [slug, maxLength(120)] },
  status: { validators: [oneOf(publicationStatuses)] },
};

const projectSchema = {
  title: requiredString(180),
  category: requiredString(80),
  image: requiredHttpsUrl,
  description: requiredString(1000),
  slug: { validators: [slug, maxLength(120)] },
  content: {
    validators: [(value) => (
      typeof value === 'string' || isPlainObject(value) ? null : 'must be rich text content'
    )],
  },
  link: optionalInternalOrHttpsUrl,
  status: { validators: [oneOf(publicationStatuses)] },
  featured: { validators: [boolean] },
  startDate: { validators: [validDate, dateOrdering('endDate')] },
  endDate: { validators: [validDate] },
  client: optionalString(160),
};

const serviceSeoSchema = {
  title: optionalString(180),
  description: optionalString(300),
  ogImage: optionalHttpsUrl,
};

const serviceSeo = (value) => {
  if (!isPlainObject(value)) return 'must be an object';

  const validation = validatePayload(value, serviceSeoSchema, { partial: true });
  return validation.valid ? null : validation.errors[0].message;
};

const serviceSchema = {
  title: requiredString(180),
  slug: { validators: [slug, maxLength(120)] },
  description: requiredString(1000),
  detail: optionalString(5000),
  features: { validators: [stringArray(240)] },
  includes: { validators: [stringArray(240)] },
  process: { validators: [stringArray(240)] },
  image: requiredHttpsUrl,
  status: { validators: [oneOf(publicationStatuses)] },
  order: { validators: [nonNegativeNumber] },
  seo: { validators: [serviceSeo] },
};

const contactCreateSchema = {
  name: requiredString(120),
  email: { required: true, validators: [email, maxLength(254)] },
  phone: optionalString(40),
  subject: requiredString(180),
  message: requiredString(3000),
};

const contactUpdateSchema = {
  status: { validators: [oneOf(contactStatuses)] },
};

const siteSettingsSchema = {
  'company.name': requiredString(180),
  'company.tagline': optionalString(220),
  'company.address': optionalString(300),
  'company.phone': optionalString(50),
  'company.phoneRaw': optionalString(30),
  'company.email': { required: true, validators: [email, maxLength(254)] },
  'company.workingHours': optionalString(120),
  'social.facebook': optionalHttpsUrl,
  'social.zalo': optionalHttpsUrl,
  'seo.title': optionalString(180),
  'seo.description': optionalString(300),
  'seo.ogImage': optionalHttpsUrl,
};

const mediaMetadataSchema = {
  url: requiredHttpsUrl,
  publicId: requiredString(255),
  alt: optionalString(180),
  folder: { validators: [string, oneOf(allowedFolders), maxLength(80)] },
  mimeType: { required: true, validators: [string, oneOf(allowedImageTypes)] },
  size: { required: true, validators: [nonNegativeNumber] },
};

const mediaUploadBodySchema = {
  alt: optionalString(180),
  folder: { validators: [string, oneOf(allowedFolders), maxLength(80)] },
};

const mediaUpdateSchema = {
  alt: optionalString(180),
};

const validateFlatSettings = (settings) => {
  const errors = [];
  const payload = { company: {}, social: {}, seo: {} };

  for (const [path, rules] of Object.entries(siteSettingsSchema)) {
    const parts = path.split('.');
    let parent = settings;
    for (const part of parts.slice(0, -1)) parent = parent?.[part];
    const field = parts.at(-1);

    const validation = validatePayload(parent || {}, { [field]: rules });
    errors.push(...validation.errors.map((error) => ({
      field: path,
      message: error.message,
    })));

    if (parent && hasOwn(parent, field)) {
      payload[parts[0]][field] = parent[field];
    }
  }

  return {
    valid: errors.length === 0,
    message: errors[0]?.message,
    errors,
    payload,
  };
};

const validateNewsPayload = (body, options) => validatePayload(body, newsSchema, options);
const validateProjectPayload = (body, options) => validatePayload(body, projectSchema, options);
const validateServicePayload = (body, options) => {
  const validation = validatePayload(body, serviceSchema, options);

  if (isPlainObject(validation.payload.seo)) {
    validation.payload.seo = validatePayload(validation.payload.seo, serviceSeoSchema, { partial: true }).payload;
  }

  return validation;
};
const validateContactCreatePayload = (body, options) => validatePayload(body, contactCreateSchema, options);
const validateContactUpdatePayload = (body, options) => validatePayload(body, contactUpdateSchema, options);
const validateMediaMetadata = (body, options) => validatePayload(body, mediaMetadataSchema, options);
const validateMediaUploadBody = (body, options) => validatePayload(body, mediaUploadBodySchema, options);
const validateMediaUpdatePayload = (body, options) => validatePayload(body, mediaUpdateSchema, options);

module.exports = {
  assertValidPayload,
  contactStatuses,
  publicationStatuses,
  validateContactCreatePayload,
  validateContactUpdatePayload,
  validateFlatSettings,
  validateMediaMetadata,
  validateMediaUpdatePayload,
  validateMediaUploadBody,
  validateNewsPayload,
  validateProjectPayload,
  validateServicePayload,
};
