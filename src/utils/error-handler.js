const { logger } = require('./logger');

class ErrorHandler {
  constructor() {
    this.errors = [];
  }

  logError(error, message) {
    const errorData = {
      timestamp: new Date(),
      error,
      message,
    };

    this.errors.push(errorData);
    logger.error(`Error occurred: ${message}`, error);
  }

  logWarning(warning, message) {
    const warningData = {
      timestamp: new Date(),
      warning,
      message,
    };

    this.errors.push(warningData);
    logger.warn(`Warning occurred: ${message}`, warning);
  }

  getErrors() {
    return this.errors;
  }

  clearErrors() {
    this.errors = [];
  }
}

module.exports = { ErrorHandler };