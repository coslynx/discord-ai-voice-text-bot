const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { ConversationModel } = require('../models/conversation-model');
const { UserModel } = require('../models/user-model');
const { getDiscordApiService } = require('../services/discord-api-service');

class TextMessageProcessing {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
    this.discordApiService = getDiscordApiService();
  }

  async processMessage(userId, guildId, message) {
    try {
      // 1. Get User and Conversation
      const user = await this.databaseService.getUserById(userId);
      const conversation = await this.databaseService.getConversationByUserIdAndGuildId(
        userId,
        guildId,
      );

      // 2. Sanitize and Validate Input
      const sanitizedMessage = this.sanitizeInput(message);
      if (!this.validateInput(sanitizedMessage)) {
        // Handle invalid input: send error message, log to monitoring system, etc.
        return;
      }

      // 3. Determine Response Strategy
      let response;
      if (sanitizedMessage.startsWith('!')) {
        // Handle commands
        response = await this.handleCommand(sanitizedMessage);
      } else {
        // Use conversation engine for general responses
        response = await this.generateResponse(userId, guildId, sanitizedMessage);
      }

      // 4. Update Conversation and Learn
      if (conversation) {
        conversation.addMessage(sanitizedMessage, response);
        await this.databaseService.updateConversation(conversation.id, conversation.data);
        // Optionally, use the conversation for adaptive learning if implemented
      }

      // 5. Send Response to User
      await this.discordApiService.sendMessage(guildId, message.channelId, response);

      logger.info(
        `Text message processed successfully for user ${userId} on guild ${guildId}`,
      );
    } catch (error) {
      logger.error(`Error processing text message: ${error.message}`);
      // Handle error: send error message to user, log to monitoring system, etc.
    }
  }

  async handleCommand(command) {
    try {
      if (command.startsWith('!help')) {
        // Provide help information about available commands
        return 'Available commands: !help, !generate, !settings';
      } else if (command.startsWith('!generate')) {
        const prompt = command.split('!generate ')[1];
        if (prompt) {
          const response = await this.openAIService.generateResponse(prompt);
          return response;
        } else {
          // Handle invalid command
          return 'Invalid command. Please provide a prompt after !generate.';
        }
      } else if (command.startsWith('!settings')) {
        // Handle user settings commands (e.g., personality, preferences)
        return 'Settings commands are not yet implemented.';
      } else {
        // Handle unknown command
        return 'Unknown command. Type !help for available commands.';
      }
    } catch (error) {
      logger.error(`Error handling command: ${error.message}`);
      // Handle error: send error message to user, log to monitoring system, etc.
    }
  }

  async generateResponse(userId, guildId, message) {
    try {
      // 1. Get User and Conversation
      const user = await this.databaseService.getUserById(userId);
      const conversation = await this.databaseService.getConversationByUserIdAndGuildId(
        userId,
        guildId,
      );

      // 2. Generate Response using OpenAI
      const response = await this.openAIService.generateResponse(message, {
        userPersonality: user.personality,
        topicsOfInterest: user.topicsOfInterest,
        conversationContext: conversation ? conversation.messages : [],
      });

      return response;
    } catch (error) {
      logger.error(`Error generating response: ${error.message}`);
      // Handle error: send error message to user, log to monitoring system, etc.
    }
  }

  sanitizeInput(input) {
    // Implement logic to sanitize user input:
    // - Remove potentially harmful characters (e.g., HTML tags, script tags)
    // - Encode special characters
    // - Limit input length if necessary
    return input.trim();
  }

  validateInput(input) {
    // Implement logic to validate user input:
    // - Check for empty input
    // - Check for specific keywords or phrases
    // - Limit input length if necessary
    return input.length > 0;
  }
}

module.exports = { TextMessageProcessing };