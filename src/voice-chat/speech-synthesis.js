const { getSpeechToTextService, getTextToSpeechService } = require('../services/speech-recognition-service');
const { logger } = require('../utils/logger');

class SpeechSynthesis {
  constructor() {
    this.speechToTextService = getSpeechToTextService();
    this.textToSpeechService = getTextToSpeechService();
  }

  async synthesizeSpeech(text) {
    try {
      const audioBuffer = await this.textToSpeechService.synthesizeSpeech(text);
      logger.info(`Speech synthesized successfully for text: ${text}`);
      return audioBuffer;
    } catch (error) {
      logger.error(`Error synthesizing speech: ${error.message}`);
      // Handle error: inform user, retry, etc.
      throw error;
    }
  }
}

module.exports = { SpeechSynthesis };