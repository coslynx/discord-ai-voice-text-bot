const { logger } = require('../utils/logger');
const { ErrorHandler } = require('../utils/error-handler');

const errorHandler = new ErrorHandler();

module.exports = (err, req, res, next) => {
  logger.error('An error occurred:', err);
  errorHandler.logError(err, 'API Error');

  // Set appropriate response based on the error type
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: 'Unauthorized: Invalid credentials.' });
  } else if (err.name === 'ForbiddenError') {
    res.status(403).json({ message: 'Forbidden: Insufficient permissions.' });
  } else if (err.name === 'NotFoundError') {
    res.status(404).json({ message: 'Not Found: Resource not found.' });
  } else if (err.name === 'ValidationError') {
    res.status(400).json({ message: 'Bad Request: Invalid input data.' });
  } else {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};