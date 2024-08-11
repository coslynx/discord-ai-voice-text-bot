const { getSpeechToTextService, getTextToSpeechService } = require('../services/speech-recognition-service');
const { logger } = require('../utils/logger');
const { DatabaseService } = require('../services/database-service');
const { UserModel } = require('../models/user-model');

class VoiceOptions {
  constructor() {
    this.speechToTextService = getSpeechToTextService();
    this.textToSpeechService = getTextToSpeechService();
    this.databaseService = new DatabaseService();
  }

  async getAvailableVoices() {
    try {
      const voices = await this.textToSpeechService.getAvailableVoices();
      logger.info('Available voices retrieved successfully.');
      return voices;
    } catch (error) {
      logger.error(`Error retrieving available voices: ${error.message}`);
      throw error;
    }
  }

  async getUserVoicePreference(userId) {
    try {
      const user = await this.databaseService.getUserById(userId);

      if (!user) {
        logger.warn(`User not found for voice preference: ${userId}`);
        return null;
      }

      const userVoicePreference = user.voicePreference; // Assuming user has voicePreference setting
      logger.info(`User voice preference retrieved: ${userVoicePreference}`);
      return userVoicePreference;
    } catch (error) {
      logger.error(`Error retrieving user voice preference: ${error.message}`);
      throw error;
    }
  }

  async setUserVoicePreference(userId, voiceName) {
    try {
      const user = await this.databaseService.getUserById(userId);

      if (!user) {
        logger.warn(`User not found for voice preference update: ${userId}`);
        return;
      }

      await this.databaseService.updateUser(userId, {
        voicePreference: voiceName,
      });

      logger.info(`User voice preference updated successfully for user ${userId}`);
    } catch (error) {
      logger.error(`Error updating user voice preference: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { VoiceOptions };