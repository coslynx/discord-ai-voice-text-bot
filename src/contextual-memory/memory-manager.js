const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { ConversationModel } = require('../models/conversation-model');

class MemoryManager {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
  }

  async storeConversation(userId, guildId, conversation) {
    try {
      const conversationModel = new ConversationModel(conversation);
      await this.databaseService.createConversation(conversationModel.data);
      logger.info(
        `Conversation stored successfully for user ${userId} on guild ${guildId}`,
      );
    } catch (error) {
      logger.error(`Error storing conversation: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
    }
  }

  async retrieveConversation(userId, guildId) {
    try {
      const conversationData = await this.databaseService.getConversationByUserIdAndGuildId(
        userId,
        guildId,
      );

      if (!conversationData) {
        logger.warn('Conversation not found.');
        return null;
      }

      const conversation = new ConversationModel(conversationData);
      logger.info(
        `Conversation retrieved successfully for user ${userId} on guild ${guildId}`,
      );
      return conversation;
    } catch (error) {
      logger.error(`Error retrieving conversation: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async updateConversation(conversationId, conversation) {
    try {
      const conversationModel = new ConversationModel(conversation);
      await this.databaseService.updateConversation(
        conversationId,
        conversationModel.data,
      );
      logger.info(`Conversation updated successfully: ${conversationId}`);
    } catch (error) {
      logger.error(`Error updating conversation: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async deleteConversation(conversationId) {
    try {
      await this.databaseService.deleteConversation(conversationId);
      logger.info(`Conversation deleted successfully: ${conversationId}`);
    } catch (error) {
      logger.error(`Error deleting conversation: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async getConversationContext(userId, guildId) {
    try {
      const conversation = await this.retrieveConversation(userId, guildId);
      if (conversation) {
        return conversation.messages;
      }
      return [];
    } catch (error) {
      logger.error(
        `Error retrieving conversation context for user ${userId} on guild ${guildId}: ${error.message}`,
      );
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }
}

module.exports = { MemoryManager };