const { logger } = require('../utils/logger');

const loggingMiddleware = (req, res, next) => {
  const startTime = Date.now();
  const method = req.method;
  const url = req.url;

  logger.info(`[${method}] Request to ${url} - Starting`);

  res.on('finish', () => {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    const statusCode = res.statusCode;
    const responseSize = res.get('Content-Length') || 0;

    logger.info(
      `[${method}] Request to ${url} - Completed (status: ${statusCode}, time: ${responseTime}ms, size: ${responseSize} bytes)`,
    );
  });

  next();
};

module.exports = { loggingMiddleware };