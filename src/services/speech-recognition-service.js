const { SpeechClient } = require('@google-cloud/speech');
const { logger } = require('../utils/logger');
const { GOOGLE_APPLICATION_CREDENTIALS } = require('../config/env-config');

const client = new SpeechClient({
  keyFilename: GOOGLE_APPLICATION_CREDENTIALS,
});

async function transcribeSpeech(voiceData) {
  try {
    const [response] = await client.recognize(
      {
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'en-US', // Set to your desired language
        },
        audio: { content: voiceData },
      },
      { autoPaginate: true },
    );

    if (response.results.length > 0) {
      const transcribedText = response.results[0].alternatives[0].transcript;
      logger.info('Speech transcribed successfully:', transcribedText);
      return transcribedText;
    }

    logger.warn('No speech detected in the audio.');
    return '';
  } catch (error) {
    logger.error(`Error transcribing speech: ${error.message}`);
    throw error;
  }
}

async function getSpeechToTextService() {
  return { transcribeSpeech };
}

module.exports = {
  getSpeechToTextService,
};