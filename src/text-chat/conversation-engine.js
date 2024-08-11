const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { ConversationModel } = require('../models/conversation-model');
const { UserModel } = require('../models/user-model');
const { TopicBasedResponses } = require('./topic-based-responses');
const { AdaptiveResponseLearning } = require('./adaptive-response-learning');
const { CreativeTextGeneration } = require('./creative-text-generation');
const { getDiscordApiService } = require('../services/discord-api-service');

class ConversationEngine {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
    this.topicBasedResponses = new TopicBasedResponses();
    this.adaptiveResponseLearning = new AdaptiveResponseLearning();
    this.creativeTextGeneration = new CreativeTextGeneration();
    this.discordApiService = getDiscordApiService();
  }

  async handleTextMessage(userId, guildId, message) {
    try {
      // 1. Get user and conversation context
      const user = await this.databaseService.getUserById(userId);
      const conversation = await this.databaseService.getConversationByUserIdAndGuildId(userId, guildId);

      // 2. Determine response strategy
      let response;
      if (message.startsWith('!')) {
        // Handle commands
        response = await this.handleCommand(message);
      } else if (user.topicsOfInterest.length > 0) {
        // Use topic-based responses
        response = await this.topicBasedResponses.getResponseForTopic(user.topicsOfInterest[0], message);
      } else {
        // Use adaptive response learning
        response = await this.adaptiveResponseLearning.getPersonalizedResponse(userId, guildId, message);
      }

      // 3. Update conversation and learn from user interaction
      if (conversation) {
        conversation.addMessage(message, response);
        await this.databaseService.updateConversation(conversation.id, conversation.data);
        this.adaptiveResponseLearning.learnFromConversation(userId, guildId, conversation.id);
      }

      // 4. Send response to user
      await this.discordApiService.sendMessage(guildId, message.channelId, response);

      logger.info(`Conversation handled successfully for user ${userId} on guild ${guildId}`);
    } catch (error) {
      logger.error(`Error handling text message: ${error.message}`);
      // Handle error: send error message to user, log to monitoring system, etc.
    }
  }

  async handleCommand(command) {
    try {
      if (command.startsWith('!generate')) {
        const prompt = command.split('!generate ')[1];
        const response = await this.creativeTextGeneration.generateCreativeText(prompt);
        return response;
      } else if (command.startsWith('!help')) {
        // Provide help information about available commands
        return 'Available commands: !generate, !help';
      } else {
        // Handle unknown command
        return 'Unknown command. Type !help for available commands.';
      }
    } catch (error) {
      logger.error(`Error handling command: ${error.message}`);
      // Handle error: send error message to user, log to monitoring system, etc.
    }
  }
}

module.exports = { ConversationEngine };