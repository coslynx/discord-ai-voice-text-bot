const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { MONGODB_URI } = require('./env-config');

module.exports = {
  connect: async () => {
    try {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('Database connected successfully.');
    } catch (error) {
      logger.error(`Error connecting to database: ${error.message}`);
      throw error;
    }
  },
  disconnect: async () => {
    try {
      await mongoose.disconnect();
      logger.info('Database disconnected successfully.');
    } catch (error) {
      logger.error(`Error disconnecting from database: ${error.message}`);
      throw error;
    }
  },
};