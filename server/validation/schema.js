const hasOwn = (value, field) => Object.prototype.hasOwnProperty.call(value, field);

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

class ValidationError extends Error {
  constructor(errors) {
    super(errors[0]?.message || 'Validation error');
    this.name = 'ValidationError';
    this.statusCode = 400;
    this.errors = errors;
  }
}

const fail = (field, message) => ({ field, message });

const filterFields = (body, allowedFields) => {
  if (!isPlainObject(body)) return {};

  return Object.keys(body).reduce((acc, key) => {
    if (allowedFields.includes(key)) acc[key] = body[key];
    return acc;
  }, {});
};

const validatePayload = (body, schema, { partial = false } = {}) => {
  const source = isPlainObject(body) ? body : {};
  const payload = filterFields(source, Object.keys(schema));
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const exists = hasOwn(source, field);
    const value = source[field];

    if (rules.required && (!partial || exists)) {
      if (value === undefined || value === null || (typeof value === 'string' && value.trim().length === 0)) {
        errors.push(fail(field, `${field} is required`));
        continue;
      }
    }

    if (!exists || value === undefined || value === null || value === '') continue;

    for (const rule of rules.validators || []) {
      const error = rule(value, source);
      if (error) errors.push(fail(field, `${field} ${error}`));
    }
  }

  return {
    valid: errors.length === 0,
    message: errors[0]?.message,
    errors,
    payload,
  };
};

const assertValidPayload = (body, schema, options) => {
  const validation = validatePayload(body, schema, options);
  if (!validation.valid) throw new ValidationError(validation.errors);
  return validation.payload;
};

const maxLength = (max) => (value) => (
  typeof value === 'string' && value.length > max ? `must be at most ${max} characters` : null
);

const string = (value) => (
  typeof value !== 'string' ? 'must be a string' : null
);

const nonEmptyString = (value) => {
  if (typeof value !== 'string') return 'must be a string';
  return value.trim().length === 0 ? 'is required' : null;
};

const boolean = (value) => (
  typeof value !== 'boolean' ? 'must be a boolean' : null
);

const number = (value) => (
  typeof value !== 'number' || Number.isNaN(value) ? 'must be a number' : null
);

const nonNegativeNumber = (value) => {
  const error = number(value);
  if (error) return error;
  return value < 0 ? 'must be greater than or equal to 0' : null;
};

const oneOf = (values) => (value) => (
  values.includes(value) ? null : `must be one of: ${values.join(', ')}`
);

const validDate = (value) => (
  Number.isNaN(new Date(value).getTime()) ? 'must be a valid date' : null
);

const slug = (value) => {
  if (typeof value !== 'string') return 'must be a string';
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? null : 'must be a valid slug';
};

const email = (value) => {
  if (typeof value !== 'string') return 'must be a string';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? null : 'must be a valid email';
};

const httpsUrl = (value) => {
  if (typeof value !== 'string') return 'must be a URL string';

  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' ? null : 'must use https';
  } catch {
    return 'must be a valid URL';
  }
};

const internalPathOrHttpsUrl = (value) => {
  if (typeof value !== 'string') return 'must be a URL string';
  const trimmed = value.trim();

  if (trimmed.startsWith('/') && !trimmed.startsWith('//') && !trimmed.includes('\\')) return null;
  return httpsUrl(trimmed);
};

module.exports = {
  ValidationError,
  assertValidPayload,
  boolean,
  email,
  filterFields,
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
};
