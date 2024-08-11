const { logger } = require('./logger');

/
  Validates a Discord user ID.
 
  @param {string} userId The Discord user ID to validate.
  @returns {boolean} True if the user ID is valid, false otherwise.
 /
const isValidUserId = (userId) => {
  if (typeof userId !== 'string') {
    logger.error('Invalid user ID: must be a string.');
    return false;
  }

  if (!userId.match(/^\d+$/)) {
    logger.error('Invalid user ID: must be a number.');
    return false;
  }

  return true;
};

/
  Validates a Discord guild ID.
 
  @param {string} guildId The Discord guild ID to validate.
  @returns {boolean} True if the guild ID is valid, false otherwise.
 /
const isValidGuildId = (guildId) => {
  if (typeof guildId !== 'string') {
    logger.error('Invalid guild ID: must be a string.');
    return false;
  }

  if (!guildId.match(/^\d+$/)) {
    logger.error('Invalid guild ID: must be a number.');
    return false;
  }

  return true;
};

/
  Validates a Discord channel ID.
 
  @param {string} channelId The Discord channel ID to validate.
  @returns {boolean} True if the channel ID is valid, false otherwise.
 /
const isValidChannelId = (channelId) => {
  if (typeof channelId !== 'string') {
    logger.error('Invalid channel ID: must be a string.');
    return false;
  }

  if (!channelId.match(/^\d+$/)) {
    logger.error('Invalid channel ID: must be a number.');
    return false;
  }

  return true;
};

/
  Validates a Discord message content.
 
  @param {string} message The Discord message content to validate.
  @returns {boolean} True if the message is valid, false otherwise.
 /
const isValidMessageContent = (message) => {
  if (typeof message !== 'string') {
    logger.error('Invalid message content: must be a string.');
    return false;
  }

  // Implement additional validation rules as needed (e.g., length limits, prohibited words).
  // ...

  return true;
};

/
  Validates a Discord voice data buffer.
 
  @param {Buffer} voiceData The Discord voice data buffer to validate.
  @returns {boolean} True if the voice data is valid, false otherwise.
 /
const isValidVoiceData = (voiceData) => {
  if (!Buffer.isBuffer(voiceData)) {
    logger.error('Invalid voice data: must be a Buffer.');
    return false;
  }

  // Implement additional validation rules as needed (e.g., size limits, data format checks).
  // ...

  return true;
};

module.exports = {
  isValidUserId,
  isValidGuildId,
  isValidChannelId,
  isValidMessageContent,
  isValidVoiceData,
};