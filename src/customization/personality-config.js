const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { PersonalityModel } = require('../models/personality-model');

class PersonalityConfig {
  constructor() {
    this.openAIService = getOpenAIService();
    this.databaseService = new DatabaseService();
  }

  async getAvailablePersonalities() {
    try {
      const personalities = await this.databaseService.getAllPersonalities();
      logger.info('Available personalities retrieved successfully.');
      return personalities;
    } catch (error) {
      logger.error(`Error retrieving available personalities: ${error.message}`);
      throw error;
    }
  }

  async getUserPersonality(userId) {
    try {
      const user = await this.databaseService.getUserById(userId);

      if (!user) {
        logger.warn(`User not found for personality retrieval: ${userId}`);
        return null;
      }

      const userPersonality = user.personality; // Assuming user has personality setting
      logger.info(`User personality retrieved: ${userPersonality}`);
      return userPersonality;
    } catch (error) {
      logger.error(`Error retrieving user personality: ${error.message}`);
      throw error;
    }
  }

  async setUserPersonality(userId, personalityName) {
    try {
      const user = await this.databaseService.getUserById(userId);

      if (!user) {
        logger.warn(`User not found for personality update: ${userId}`);
        return;
      }

      const personality = await this.databaseService.getPersonalityByName(
        personalityName,
      );

      if (!personality) {
        logger.warn(`Personality not found: ${personalityName}`);
        return;
      }

      const personalityModel = new PersonalityModel(personality);
      await this.databaseService.updateUser(userId, {
        personality: personalityModel.name,
        // Optionally update other settings based on the chosen personality
      });

      logger.info(`User personality updated successfully for user ${userId}`);
    } catch (error) {
      logger.error(`Error updating user personality: ${error.message}`);
      throw error;
    }
  }

  async createPersonality(personalityName, personalityDescription, tone, style) {
    try {
      const personality = await this.databaseService.createPersonality(
        personalityName,
        personalityDescription,
        tone,
        style,
      );

      logger.info(`Personality created successfully: ${personalityName}`);
      return personality;
    } catch (error) {
      logger.error(`Error creating personality: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { PersonalityConfig };