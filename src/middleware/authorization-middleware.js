const { logger } = require('../utils/logger');
const { getDiscordApiService } = require('../services/discord-api-service');
const { DatabaseService } = require('../services/database-service');
const { UserModel } = require('../models/user-model');

const databaseService = new DatabaseService();
const discordApiService = getDiscordApiService();

const authorizationMiddleware = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const user = await databaseService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement authorization logic here
    // Example: Check if the user has a specific role or permission
    // if (user.roles.includes('admin')) {
    //   next();
    // } else {
    //   return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    // }

    next();
  } catch (error) {
    logger.error(`Error authorizing request: ${error.message}`);
    return res.status(500).json({ message: 'Failed to authorize request' });
  }
};

module.exports = { authorizationMiddleware };