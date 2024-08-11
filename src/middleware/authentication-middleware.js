const { logger } = require('../utils/logger');
const { getDiscordApiService } = require('../services/discord-api-service');
const { DatabaseService } = require('../services/database-service');
const { JWT_SECRET } = require('../config/env-config');
const jwt = require('jsonwebtoken');

const databaseService = new DatabaseService();
const discordApiService = getDiscordApiService();

const authenticationMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    try {
      const decodedToken = jwt.verify(token, JWT_SECRET);
      req.userId = decodedToken.userId;
      next();
    } catch (error) {
      logger.error(`Error verifying JWT token: ${error.message}`);
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
  } catch (error) {
    logger.error(`Error authenticating request: ${error.message}`);
    return res.status(500).json({ message: 'Failed to authenticate request' });
  }
};

module.exports = { authenticationMiddleware };