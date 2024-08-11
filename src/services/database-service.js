const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const { MONGODB_URI } = require('../config/env-config');

class DatabaseService {
  constructor() {
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      logger.info('Database connected successfully.');
    } catch (error) {
      logger.error(`Error connecting to database: ${error.message}`);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.connection) {
        await this.connection.disconnect();
        logger.info('Database disconnected successfully.');
      }
    } catch (error) {
      logger.error(`Error disconnecting from database: ${error.message}`);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const user = await this.connection.model('User').create(userData);
      logger.info(`User created successfully with ID: ${user._id}`);
      return user;
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async getUserById(userId) {
    try {
      const user = await this.connection.model('User').findById(userId);
      if (!user) {
        logger.warn(`User not found with ID: ${userId}`);
        return null;
      }
      logger.info(`User retrieved successfully with ID: ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error retrieving user: ${error.message}`);
      throw error;
    }
  }

  async updateUser(userId, updatedData) {
    try {
      const user = await this.connection.model('User').findByIdAndUpdate(
        userId,
        updatedData,
        { new: true },
      );
      if (!user) {
        logger.warn(`User not found with ID: ${userId}`);
        return null;
      }
      logger.info(`User updated successfully with ID: ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  async deleteUser(userId) {
    try {
      const user = await this.connection.model('User').findByIdAndDelete(userId);
      if (!user) {
        logger.warn(`User not found with ID: ${userId}`);
        return null;
      }
      logger.info(`User deleted successfully with ID: ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }

  async createConversation(conversationData) {
    try {
      const conversation = await this.connection.model('Conversation').create(
        conversationData,
      );
      logger.info(
        `Conversation created successfully with ID: ${conversation._id}`,
      );
      return conversation;
    } catch (error) {
      logger.error(`Error creating conversation: ${error.message}`);
      throw error;
    }
  }

  async getConversationById(conversationId) {
    try {
      const conversation = await this.connection.model(
        'Conversation',
      ).findById(conversationId);
      if (!conversation) {
        logger.warn(`Conversation not found with ID: ${conversationId}`);
        return null;
      }
      logger.info(
        `Conversation retrieved successfully with ID: ${conversationId}`,
      );
      return conversation;
    } catch (error) {
      logger.error(`Error retrieving conversation: ${error.message}`);
      throw error;
    }
  }

  async getConversationByUserIdAndGuildId(userId, guildId) {
    try {
      const conversation = await this.connection.model('Conversation').findOne({
        userId,
        guildId,
      });
      if (!conversation) {
        logger.warn(
          `Conversation not found for user ${userId} on guild ${guildId}`,
        );
        return null;
      }
      logger.info(
        `Conversation retrieved successfully for user ${userId} on guild ${guildId}`,
      );
      return conversation;
    } catch (error) {
      logger.error(
        `Error retrieving conversation for user ${userId} on guild ${guildId}: ${error.message}`,
      );
      throw error;
    }
  }

  async updateConversation(conversationId, updatedData) {
    try {
      const conversation = await this.connection.model(
        'Conversation',
      ).findByIdAndUpdate(conversationId, updatedData, { new: true });
      if (!conversation) {
        logger.warn(`Conversation not found with ID: ${conversationId}`);
        return null;
      }
      logger.info(
        `Conversation updated successfully with ID: ${conversationId}`,
      );
      return conversation;
    } catch (error) {
      logger.error(`Error updating conversation: ${error.message}`);
      throw error;
    }
  }

  async deleteConversation(conversationId) {
    try {
      const conversation = await this.connection.model(
        'Conversation',
      ).findByIdAndDelete(conversationId);
      if (!conversation) {
        logger.warn(`Conversation not found with ID: ${conversationId}`);
        return null;
      }
      logger.info(
        `Conversation deleted successfully with ID: ${conversationId}`,
      );
      return conversation;
    } catch (error) {
      logger.error(`Error deleting conversation: ${error.message}`);
      throw error;
    }
  }

  async createPersonality(personalityData) {
    try {
      const personality = await this.connection.model('Personality').create(
        personalityData,
      );
      logger.info(
        `Personality created successfully with name: ${personality.name}`,
      );
      return personality;
    } catch (error) {
      logger.error(`Error creating personality: ${error.message}`);
      throw error;
    }
  }

  async getPersonalityByName(personalityName) {
    try {
      const personality = await this.connection.model('Personality').findOne({
        name: personalityName,
      });
      if (!personality) {
        logger.warn(`Personality not found with name: ${personalityName}`);
        return null;
      }
      logger.info(
        `Personality retrieved successfully with name: ${personalityName}`,
      );
      return personality;
    } catch (error) {
      logger.error(`Error retrieving personality: ${error.message}`);
      throw error;
    }
  }

  async getAllPersonalities() {
    try {
      const personalities = await this.connection.model(
        'Personality',
      ).find();
      logger.info('All personalities retrieved successfully.');
      return personalities;
    } catch (error) {
      logger.error(`Error retrieving all personalities: ${error.message}`);
      throw error;
    }
  }

  async createTask(taskData) {
    try {
      const task = await this.connection.model('Task').create(taskData);
      logger.info(`Task created successfully with ID: ${task._id}`);
      return task;
    } catch (error) {
      logger.error(`Error creating task: ${error.message}`);
      throw error;
    }
  }

  async getTaskById(taskId) {
    try {
      const task = await this.connection.model('Task').findById(taskId);
      if (!task) {
        logger.warn(`Task not found with ID: ${taskId}`);
        return null;
      }
      logger.info(`Task retrieved successfully with ID: ${taskId}`);
      return task;
    } catch (error) {
      logger.error(`Error retrieving task: ${error.message}`);
      throw error;
    }
  }

  async updateTask(taskId, updatedData) {
    try {
      const task = await this.connection.model('Task').findByIdAndUpdate(
        taskId,
        updatedData,
        { new: true },
      );
      if (!task) {
        logger.warn(`Task not found with ID: ${taskId}`);
        return null;
      }
      logger.info(`Task updated successfully with ID: ${taskId}`);
      return task;
    } catch (error) {
      logger.error(`Error updating task: ${error.message}`);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      const task = await this.connection.model('Task').findByIdAndDelete(taskId);
      if (!task) {
        logger.warn(`Task not found with ID: ${taskId}`);
        return null;
      }
      logger.info(`Task deleted successfully with ID: ${taskId}`);
      return task;
    } catch (error) {
      logger.error(`Error deleting task: ${error.message}`);
      throw error;
    }
  }

  // ... (Implement functions for storing and retrieving other data models like preferences, etc.)

  async storeUserData(userId, data) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(`User not found for data storage: ${userId}`);
        return null;
      }
      user.data = data;
      await user.save();
      logger.info(`User data stored successfully for user ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error storing user data: ${error.message}`);
      throw error;
    }
  }

  async retrieveUserData(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(`User not found for data retrieval: ${userId}`);
        return null;
      }
      logger.info(`User data retrieved successfully for user ${userId}`);
      return user.data;
    } catch (error) {
      logger.error(`Error retrieving user data: ${error.message}`);
      throw error;
    }
  }

  async deleteUserData(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(`User not found for data deletion: ${userId}`);
        return null;
      }
      user.data = null;
      await user.save();
      logger.info(`User data deleted successfully for user ${userId}`);
      return user;
    } catch (error) {
      logger.error(`Error deleting user data: ${error.message}`);
      throw error;
    }
  }

  async storeAnonymizedData(userId, data) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(`User not found for anonymized data storage: ${userId}`);
        return null;
      }
      user.anonymizedData = data;
      await user.save();
      logger.info(
        `Anonymized user data stored successfully for user ${userId}`,
      );
      return user;
    } catch (error) {
      logger.error(`Error storing anonymized user data: ${error.message}`);
      throw error;
    }
  }

  async retrieveAnonymizedData(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(
          `User not found for anonymized data retrieval: ${userId}`,
        );
        return null;
      }
      logger.info(
        `Anonymized user data retrieved successfully for user ${userId}`,
      );
      return user.anonymizedData;
    } catch (error) {
      logger.error(`Error retrieving anonymized user data: ${error.message}`);
      throw error;
    }
  }

  async deleteAnonymizedData(userId) {
    try {
      const user = await this.getUserById(userId);
      if (!user) {
        logger.warn(
          `User not found for anonymized data deletion: ${userId}`,
        );
        return null;
      }
      user.anonymizedData = null;
      await user.save();
      logger.info(
        `Anonymized user data deleted successfully for user ${userId}`,
      );
      return user;
    } catch (error) {
      logger.error(`Error deleting anonymized user data: ${error.message}`);
      throw error;
    }
  }
}

module.exports = { DatabaseService };