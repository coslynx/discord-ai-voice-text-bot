const { createClient } = require('redis');
const { logger } = require('../utils/logger');
const { REDIS_URL } = require('../config/env-config');

const redisClient = createClient({ url: REDIS_URL });

redisClient.on('error', (err) => {
  logger.error(`Redis Client Error: ${err}`);
});

async function connect() {
  try {
    await redisClient.connect();
    logger.info('Redis client connected successfully.');
  } catch (error) {
    logger.error(`Error connecting to Redis: ${error.message}`);
    // Handle error: reconnect, throw error, etc.
  }
}

async function set(key, value, ttl = 3600) {
  try {
    await redisClient.set(key, value, { EX: ttl });
    logger.info(`Cache entry set for key: ${key}`);
  } catch (error) {
    logger.error(`Error setting cache entry: ${error.message}`);
    // Handle error: retry, log, etc.
  }
}

async function get(key) {
  try {
    const value = await redisClient.get(key);
    logger.info(`Cache entry retrieved for key: ${key}`);
    return value;
  } catch (error) {
    logger.error(`Error getting cache entry: ${error.message}`);
    // Handle error: log, return null, etc.
  }
}

async function delete(key) {
  try {
    await redisClient.del(key);
    logger.info(`Cache entry deleted for key: ${key}`);
  } catch (error) {
    logger.error(`Error deleting cache entry: ${error.message}`);
    // Handle error: log, retry, etc.
  }
}

module.exports = {
  connect,
  set,
  get,
  delete,
};