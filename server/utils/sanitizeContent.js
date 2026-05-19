const DEFAULT_IMAGE_HOSTS = [
  'res.cloudinary.com',
  'images.unsplash.com',
  'www.cc1.vn',
  'm.media-amazon.com',
];

const DEFAULT_LINK_HOSTS = [
  ...DEFAULT_IMAGE_HOSTS,
  'facebook.com',
  'www.facebook.com',
  'zalo.me',
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
];

class SanitizationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'SanitizationError';
    this.statusCode = 400;
  }
}

const parseHosts = (value, defaults) => {
  const configuredHosts = String(value || '')
    .split(',')
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);

  return new Set([...defaults, ...configuredHosts]);
};

const imageHosts = () => parseHosts(process.env.CMS_ALLOWED_IMAGE_HOSTS, DEFAULT_IMAGE_HOSTS);
const linkHosts = () => parseHosts(process.env.CMS_ALLOWED_LINK_HOSTS, DEFAULT_LINK_HOSTS);

const isPlainObject = (value) => Boolean(value) && typeof value === 'object' && !Array.isArray(value);

const parseContent = (content) => {
  if (typeof content !== 'string') return content;

  const trimmed = content.trim();
  if (!trimmed) return content;

  try {
    const parsed = JSON.parse(trimmed);
    return isPlainObject(parsed) && typeof parsed.type === 'string' ? parsed : content;
  } catch {
    return content;
  }
};

const isInternalPath = (value) => (
  value.startsWith('/') &&
  !value.startsWith('//') &&
  !value.includes('\\') &&
  !/[\u0000-\u001f\u007f]/.test(value)
);

const assertNoBase64Image = (value, fieldName) => {
  if (typeof value === 'string' && /^\s*data:image\//i.test(value)) {
    throw new SanitizationError(`${fieldName} cannot be a base64 image`);
  }
};

const sanitizeHttpsUrl = (value, hosts, fieldName, { allowInternalPath = false } = {}) => {
  if (typeof value !== 'string') {
    throw new SanitizationError(`${fieldName} must be a URL string`);
  }

  const trimmed = value.trim();
  if (!trimmed) {
    throw new SanitizationError(`${fieldName} is required`);
  }

  assertNoBase64Image(trimmed, fieldName);

  if (allowInternalPath && isInternalPath(trimmed)) {
    return trimmed;
  }

  let url;
  try {
    url = new URL(trimmed);
  } catch {
    throw new SanitizationError(`${fieldName} must be a valid URL`);
  }

  if (url.protocol !== 'https:') {
    throw new SanitizationError(`${fieldName} must use https`);
  }

  if (!hosts.has(url.hostname.toLowerCase())) {
    throw new SanitizationError(`${fieldName} host is not approved`);
  }

  return url.toString();
};

const sanitizeImageUrl = (value, fieldName = 'image') => (
  sanitizeHttpsUrl(value, imageHosts(), fieldName)
);

const sanitizeLinkHref = (value, fieldName = 'href') => (
  sanitizeHttpsUrl(value, linkHosts(), fieldName, { allowInternalPath: true })
);

const sanitizeAttrs = (attrs) => {
  if (!isPlainObject(attrs)) return attrs;

  return Object.keys(attrs).reduce((acc, key) => {
    if (/^on/i.test(key) || key === 'style' || key === 'srcdoc') return acc;
    acc[key] = attrs[key];
    return acc;
  }, {});
};

const sanitizeMark = (mark) => {
  if (!isPlainObject(mark)) return mark;

  const next = { ...mark };
  if (isPlainObject(next.attrs)) {
    next.attrs = sanitizeAttrs(next.attrs);

    if (next.type === 'link' && Object.prototype.hasOwnProperty.call(next.attrs, 'href')) {
      next.attrs.href = sanitizeLinkHref(next.attrs.href, 'link href');
    }
  }

  return next;
};

const sanitizeNode = (node) => {
  if (!isPlainObject(node)) return node;

  const next = { ...node };

  if (isPlainObject(next.attrs)) {
    next.attrs = sanitizeAttrs(next.attrs);

    if (next.type === 'image' && Object.prototype.hasOwnProperty.call(next.attrs, 'src')) {
      next.attrs.src = sanitizeImageUrl(next.attrs.src, 'image src');
    }

    if (next.type === 'youtube' && Object.prototype.hasOwnProperty.call(next.attrs, 'src')) {
      next.attrs.src = sanitizeLinkHref(next.attrs.src, 'youtube src');
    }
  }

  if (Array.isArray(next.marks)) {
    next.marks = next.marks.map(sanitizeMark);
  }

  if (Array.isArray(next.content)) {
    next.content = next.content.map(sanitizeNode);
  }

  return next;
};

const sanitizeTiptapContent = (content) => {
  assertNoBase64Image(content, 'content');

  const parsed = parseContent(content);
  if (!isPlainObject(parsed) || typeof parsed.type !== 'string') {
    return content;
  }

  return sanitizeNode(parsed);
};

const sanitizeOptionalImageUrl = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return value;
  return sanitizeImageUrl(value, fieldName);
};

const sanitizeOptionalLinkHref = (value, fieldName) => {
  if (value === undefined || value === null || value === '') return value;
  return sanitizeLinkHref(value, fieldName);
};

module.exports = {
  SanitizationError,
  sanitizeImageUrl,
  sanitizeLinkHref,
  sanitizeOptionalImageUrl,
  sanitizeOptionalLinkHref,
  sanitizeTiptapContent,
};
