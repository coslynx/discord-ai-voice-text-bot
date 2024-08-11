const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { TopicModel } = require('../models/topic-model');

class TopicBasedResponses {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
  }

  async getResponseForTopic(topicName, message) {
    try {
      const topic = await this.databaseService.getTopicByName(topicName);

      if (!topic) {
        logger.warn(`Topic not found: ${topicName}`);
        return this.openAIService.generateResponse(message);
      }

      const topicModel = new TopicModel(topic);
      const relevantInfo = topicModel.getRelevantInformation(message);
      const responseOptions = {
        topicContext: topicModel.context,
        relevantInformation: relevantInfo,
      };

      const response = await this.openAIService.generateResponse(
        message,
        responseOptions,
      );

      return response;
    } catch (error) {
      logger.error(`Error getting topic-based response: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { TopicBasedResponses };