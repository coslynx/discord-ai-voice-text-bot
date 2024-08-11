const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { UserModel } = require('../models/user-model');

class CommunicationStyleAdaptation {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
  }

  async adaptCommunicationStyle(userId, message) {
    try {
      const user = await this.databaseService.getUserById(userId);

      if (!user) {
        logger.warn(`User not found for communication style adaptation: ${userId}`);
        return message;
      }

      const userCommunicationStyle = user.communicationStyle; // Assuming user has communicationStyle setting
      const responseOptions = {
        communicationStyle: userCommunicationStyle,
      };

      const adaptedMessage = await this.openAIService.generateResponse(message, responseOptions);
      logger.info(`Communication style adapted successfully for user ${userId}`);
      return adaptedMessage;
    } catch (error) {
      logger.error(`Error adapting communication style: ${error.message}`);
      // Handle error: log to a monitoring system, notify developers, etc.
      throw error;
    }
  }
}

module.exports = { CommunicationStyleAdaptation };