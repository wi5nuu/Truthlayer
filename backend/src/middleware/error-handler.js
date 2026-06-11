function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.message
    });
  }

  if (err.name === 'UnauthorizedError' || err.status === 401) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized'
    });
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid or expired token'
    });
  }

  if (err.message?.includes('Not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      error: 'Origin not allowed'
    });
  }

  if (err.message?.includes('timeout') || err.message?.includes('timed out')) {
    return res.status(504).json({
      success: false,
      error: 'Analysis timed out. Please try again.',
      retryable: true
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message
  });
}

module.exports = { errorHandler };
