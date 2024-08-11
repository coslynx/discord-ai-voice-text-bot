const { joinVoiceChannel, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, VoiceConnectionStatus, getVoiceConnection, createDiscordJSAdapter } = require('@discordjs/voice');
const { getSpeechToTextService, getTextToSpeechService } = require('../services/speech-recognition-service');
const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');
const { getDiscordApiService } = require('../services/discord-api-service');

class VoiceChannelManager {
  constructor(guildId, channelId) {
    this.guildId = guildId;
    this.channelId = channelId;
    this.voiceConnection = null;
    this.audioPlayer = null;
    this.speechToTextService = getSpeechToTextService();
    this.textToSpeechService = getTextToSpeechService();
    this.openAIService = getOpenAIService();
    this.discordApiService = getDiscordApiService();
  }

  async joinVoiceChannel() {
    try {
      const connection = joinVoiceChannel({
        channelId: this.channelId,
        guildId: this.guildId,
        adapterCreator: createDiscordJSAdapter(this.discordApiService.getClient()),
      });

      this.voiceConnection = connection;
      this.audioPlayer = createAudioPlayer();
      this.voiceConnection.subscribe(this.audioPlayer);
      logger.info(`Bot joined voice channel ${this.channelId} on guild ${this.guildId}`);
    } catch (error) {
      logger.error(`Error joining voice channel: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async leaveVoiceChannel() {
    try {
      if (this.voiceConnection) {
        this.voiceConnection.destroy();
        this.voiceConnection = null;
        this.audioPlayer = null;
        logger.info(`Bot left voice channel ${this.channelId} on guild ${this.guildId}`);
      }
    } catch (error) {
      logger.error(`Error leaving voice channel: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async playAudio(audioUrl) {
    try {
      const resource = createAudioResource(audioUrl, {
        inputType: StreamType.Opus,
      });

      this.audioPlayer.play(resource);
      this.audioPlayer.on(AudioPlayerStatus.Playing, () => {
        logger.info(`Playing audio in voice channel ${this.channelId} on guild ${this.guildId}`);
      });

      this.audioPlayer.on(AudioPlayerStatus.Idle, () => {
        logger.info(`Audio playback finished in voice channel ${this.channelId} on guild ${this.guildId}`);
      });
    } catch (error) {
      logger.error(`Error playing audio: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async handleVoiceInput(voiceData) {
    try {
      const transcribedText = await this.speechToTextService.transcribeSpeech(voiceData);
      logger.info(`Voice input transcribed: ${transcribedText}`);

      if (transcribedText.startsWith('!')) {
        // Handle voice commands
        this.handleVoiceCommand(transcribedText);
      } else {
        // Process voice input as regular conversation
        const response = await this.openAIService.generateResponse(transcribedText);
        this.playAudio(await this.textToSpeechService.synthesizeSpeech(response));
      }
    } catch (error) {
      logger.error(`Error handling voice input: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async handleVoiceCommand(command) {
    try {
      if (command.startsWith('!join')) {
        const targetChannelId = command.split(' ')[1];
        if (targetChannelId) {
          await this.leaveVoiceChannel();
          this.channelId = targetChannelId;
          await this.joinVoiceChannel();
        } else {
          // Handle invalid command
        }
      } else if (command.startsWith('!leave')) {
        await this.leaveVoiceChannel();
      } else {
        // Handle unknown command
      }
    } catch (error) {
      logger.error(`Error handling voice command: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async start() {
    try {
      await this.joinVoiceChannel();
      this.voiceConnection.on(VoiceConnectionStatus.Ready, () => {
        logger.info('Voice connection ready, listening for input');
      });

      this.voiceConnection.on(VoiceConnectionStatus.Disconnected, () => {
        logger.info(`Disconnected from voice channel ${this.channelId} on guild ${this.guildId}`);
      });

      // Handle voice input (e.g., from a user speaking in the channel)
      // ... (Implementation depends on your specific setup and the library you are using for voice input)
    } catch (error) {
      logger.error(`Error starting voice channel manager: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }

  async stop() {
    try {
      await this.leaveVoiceChannel();
    } catch (error) {
      logger.error(`Error stopping voice channel manager: ${error.message}`);
      // Handle error: inform user, disconnect from channel, etc.
    }
  }
}

module.exports = { VoiceChannelManager };