const { Client, IntentsBitField } = require('discord.js');
const { logger } = require('../utils/logger');
const { getOpenAIService } = require('./openai-service');
const { VoiceConnectionStatus } = require('@discordjs/voice');
const { getSpeechToTextService, getTextToSpeechService } = require('./speech-recognition-service');

class DiscordApiService {
  constructor() {
    this.client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildVoiceStates,
        IntentsBitField.Flags.MessageContent,
      ],
    });
    this.openAIService = getOpenAIService();
    this.speechToTextService = getSpeechToTextService();
    this.textToSpeechService = getTextToSpeechService();
  }

  getClient() {
    return this.client;
  }

  async sendMessage(guildId, channelId, message) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId);
      await channel.send(message);
      logger.info(`Message sent successfully to channel ${channelId} on guild ${guildId}`);
    } catch (error) {
      logger.error(`Error sending message: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
    }
  }

  async playAudio(guildId, audioBuffer) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const connection = getVoiceConnection(guild.id);
      if (!connection) {
        logger.warn(`No voice connection found for guild ${guildId}`);
        return;
      }
      const resource = createAudioResource(audioBuffer, {
        inputType: StreamType.Arbitrary,
      });
      const audioPlayer = createAudioPlayer();
      connection.subscribe(audioPlayer);
      audioPlayer.play(resource);
      logger.info(`Audio played successfully in voice channel`);
    } catch (error) {
      logger.error(`Error playing audio: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
    }
  }

  async getGuildMembers(guildId) {
    try {
      const guild = await this.client.guilds.fetch(guildId);
      const members = await guild.members.fetch();
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
      const guild = await this.client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(channelId);
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
      const guild = await this.client.guilds.fetch(guildId);
      const user = await guild.members.fetch(userId);
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
      const guild = await this.client.guilds.fetch(guildId);
      const connection = getVoiceConnection(guild.id);
      if (connection) {
        logger.info(`Voice connection retrieved successfully for guild ${guildId}`);
        return connection;
      }
      logger.warn(`No voice connection found for guild ${guildId}`);
      return null;
    } catch (error) {
      logger.error(`Error retrieving voice connection: ${error.message}`);
      // Handle error: log to monitoring system, notify developers, etc.
      throw error;
    }
  }

  async initialize() {
    try {
      await this.client.login(process.env.DISCORD_TOKEN);
      logger.info(`Bot logged in as ${this.client.user.tag}`);
    } catch (error) {
      logger.error(`Error logging in: ${error.message}`);
    }
  }

  async startVoiceChat(guildId, channelId) {
    try {
      const voiceChannelManager = new VoiceChannelManager(guildId, channelId);
      await voiceChannelManager.start();
    } catch (error) {
      logger.error(`Error starting voice chat: ${error.message}`);
    }
  }
}

module.exports = {
  getDiscordApiService: () => new DiscordApiService(),
};