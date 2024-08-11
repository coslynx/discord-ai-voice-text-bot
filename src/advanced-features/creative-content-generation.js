const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');

class CreativeContentGeneration {
  constructor() {
    this.openAIService = getOpenAIService();
  }

  async generateCreativeText(prompt, options = {}) {
    try {
      const response = await this.openAIService.generateResponse(prompt, options);
      logger.info(`Creative text generated successfully for prompt: ${prompt}`);
      return response;
    } catch (error) {
      logger.error(`Error generating creative text: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { CreativeContentGeneration };