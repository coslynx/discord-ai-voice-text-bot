const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const { logger } = require('../utils/logger');
const { GOOGLE_APPLICATION_CREDENTIALS } = require('../config/env-config');

const client = new TextToSpeechClient({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
});

async function synthesizeSpeech(text, voice = 'en-US-Standard-A', speakingRate = 1) {
  try {
    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: { name: voice, languageCode: voice.split('-')[0] },
      audioConfig: { audioEncoding: 'MP3', speakingRate },
    });

    logger.info('Speech synthesized successfully.');
    return response.audioContent;
  } catch (error) {
    logger.error(`Error synthesizing speech: ${error.message}`);
    throw error;
  }
}

async function getAvailableVoices() {
  try {
    const [voices] = await client.listVoices();
    logger.info('Voices retrieved successfully.');
    return voices;
  } catch (error) {
    logger.error(`Error retrieving voices: ${error.message}`);
    throw error;
  }
}

module.exports = {
  synthesizeSpeech,
  getAvailableVoices,
};