const { getSpeechToTextService } = require('../services/speech-recognition-service');
const { logger } = require('../utils/logger');

class SpeechRecognition {
  constructor() {
    this.speechToTextService = getSpeechToTextService();
  }

  async transcribeSpeech(voiceData) {
    try {
      const transcribedText = await this.speechToTextService.transcribeSpeech(voiceData);
      logger.info(`Speech transcribed successfully: ${transcribedText}`);
      return transcribedText;
    } catch (error) {
      logger.error(`Error transcribing speech: ${error.message}`);
      // Handle error: inform user, retry, etc.
      throw error;
    }
  }
}

module.exports = { SpeechRecognition };