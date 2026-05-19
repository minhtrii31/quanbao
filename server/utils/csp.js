const CLOUDINARY_ORIGINS = ['https://res.cloudinary.com'];
const YOUTUBE_FRAME_ORIGINS = ['https://www.youtube.com', 'https://www.youtube-nocookie.com'];
const YOUTUBE_MEDIA_ORIGINS = ['https://i.ytimg.com', 'https://www.youtube.com', 'https://www.youtube-nocookie.com'];

const parseOrigin = (value) => {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const unique = (values) => [...new Set(values.filter(Boolean))];

const getConfiguredOrigins = () => {
  const clientOrigin = parseOrigin(process.env.CLIENT_URL);
  const apiOrigin = parseOrigin(process.env.API_PUBLIC_URL || process.env.API_URL);

  return {
    clientOrigin,
    apiOrigin,
  };
};

const createContentSecurityPolicy = () => {
  const { clientOrigin, apiOrigin } = getConfiguredOrigins();
  const appOrigins = unique(["'self'", clientOrigin, apiOrigin]);

  return {
    useDefaults: true,
    directives: {
      'default-src': ["'self'"],
      'base-uri': ["'self'"],
      'connect-src': appOrigins,
      'font-src': ["'self'", 'https:', 'data:'],
      'form-action': appOrigins,
      'frame-ancestors': appOrigins,
      'frame-src': unique(["'self'", ...YOUTUBE_FRAME_ORIGINS]),
      'img-src': unique(["'self'", 'data:', ...CLOUDINARY_ORIGINS, ...YOUTUBE_MEDIA_ORIGINS]),
      'media-src': unique(["'self'", ...CLOUDINARY_ORIGINS]),
      'object-src': ["'none'"],
      'script-src': ["'self'"],
      'script-src-attr': ["'none'"],
      'style-src': ["'self'", 'https:'],
      'upgrade-insecure-requests': [],
    },
  };
};

const getContentSecurityPolicy = () => (
  process.env.NODE_ENV === 'production' ? createContentSecurityPolicy() : false
);

module.exports = {
  CLOUDINARY_ORIGINS,
  YOUTUBE_FRAME_ORIGINS,
  createContentSecurityPolicy,
  getContentSecurityPolicy,
};
