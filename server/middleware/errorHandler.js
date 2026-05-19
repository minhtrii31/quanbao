const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
  logger.error('request_error', {
    requestId: req.id,
    method: req.method,
    path: req.originalUrl || req.url,
    status: err.status || 500,
    message: err.message,
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(err.errors || {}).map((error) => ({
        field: error.path,
        message: error.message,
      })),
    });
  }

  if (err.name === 'MulterError') {
    const message = err.code === 'LIMIT_FILE_SIZE'
      ? 'File size exceeds 5MB limit'
      : 'Invalid file upload';

    return res.status(400).json({
      success: false,
      message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: isProduction && (err.status || 500) >= 500
      ? 'Internal server error'
      : err.message || 'Internal server error',
  });
};

module.exports = errorHandler;
