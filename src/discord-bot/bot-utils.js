const { getDiscordApiService } = require('../services/discord-api-service');
const { logger } = require('../utils/logger');

class BotUtils {
  constructor() {
    this.discordApiService = getDiscordApiService();
  }

  async sendMessage(guildId, channelId, message) {
    try {
      await this.discordApiService.sendMessage(guildId, channelId, message);
      logger.info(`Message sent successfully to channel ${channelId} on guild ${guildId}`);
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
    }
  }

  async playAudio(guildId, audioBuffer) {
    try {
      await this.discordApiService.playAudio(guildId, audioBuffer);
      logger.info(`Audio played successfully in voice channel`);
    } catch (error) {
      logger.error(`Error playing audio: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
    }
  }

  async getGuildMembers(guildId) {
    try {
      const members = await this.discordApiService.getGuildMembers(guildId);
      logger.info(`Guild members retrieved successfully for guild ${guildId}`);
      return members;
    } catch (error) {
      logger.error(`Error retrieving guild members: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async getChannelById(guildId, channelId) {
    try {
      const channel = await this.discordApiService.getChannelById(guildId, channelId);
      logger.info(`Channel retrieved successfully for guild ${guildId} and channel ${channelId}`);
      return channel;
    } catch (error) {
      logger.error(`Error retrieving channel: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async getUserById(guildId, userId) {
    try {
      const user = await this.discordApiService.getUserById(guildId, userId);
      logger.info(`User retrieved successfully for guild ${guildId} and user ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error retrieving user: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async getVoiceConnection(guildId) {
    try {
      const connection = await this.discordApiService.getVoiceConnection(guildId);
      logger.info(`Voice connection retrieved successfully for guild ${guildId}`);
      return connection;
    } catch (error) {
      logger.error(`Error retrieving voice connection: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }
}

module.exports = { BotUtils };