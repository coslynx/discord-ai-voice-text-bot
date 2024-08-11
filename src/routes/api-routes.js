const express = require('express');
const router = express.Router();
const { getDiscordApiService } = require('../services/discord-api-service');
const { DatabaseService } = require('../services/database-service');
const { logger } = require('../utils/logger');
const { UserModel } = require('../models/user-model');

const databaseService = new DatabaseService();
const discordApiService = getDiscordApiService();

// Get user profile
router.get('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await databaseService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Redact sensitive data before returning
    const redactedUserData = {
      username: user.username,
      discriminator: user.discriminator,
      avatar: user.avatar,
      personality: user.personality,
      voicePreference: user.voicePreference,
      topicsOfInterest: user.topicsOfInterest,
      communicationStyle: user.communicationStyle,
    };

    return res.status(200).json(redactedUserData);
  } catch (error) {
    logger.error(`Error getting user profile: ${error.message}`);
    return res.status(500).json({ message: 'Failed to get user profile' });
  }
});

// Update user settings
router.put('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updatedSettings = req.body;

    // Validate updated settings
    if (!updatedSettings) {
      return res.status(400).json({ message: 'Invalid settings provided' });
    }

    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedUser = await databaseService.updateUser(userId, updatedSettings);
    return res.status(200).json(updatedUser);
  } catch (error) {
    logger.error(`Error updating user settings: ${error.message}`);
    return res.status(500).json({ message: 'Failed to update user settings' });
  }
});

// Delete user account
router.delete('/profile/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await databaseService.deleteUser(userId);
    return res.status(204).send();
  } catch (error) {
    logger.error(`Error deleting user account: ${error.message}`);
    return res.status(500).json({ message: 'Failed to delete user account' });
  }
});

// Share user data
router.post('/profile/:userId/share', async (req, res) => {
  try {
    const userId = req.params.userId;
    const sharingOptions = req.body;

    // Validate sharing options
    if (!sharingOptions) {
      return res.status(400).json({ message: 'Invalid sharing options provided' });
    }

    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement logic for data sharing based on sharingOptions
    // This might involve:
    // - Updating user settings for data sharing preferences
    // - Sending anonymized data to third-party services
    // - Logging data usage events
    // ...

    return res.status(200).json({ message: 'Data sharing initiated' });
  } catch (error) {
    logger.error(`Error sharing user data: ${error.message}`);
    return res.status(500).json({ message: 'Failed to initiate data sharing' });
  }
});

// Opt out of data sharing
router.delete('/profile/:userId/share/:sharingFeature', async (req, res) => {
  try {
    const userId = req.params.userId;
    const sharingFeature = req.params.sharingFeature;

    const user = await databaseService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Implement logic to opt out of specific sharing features
    // This might involve:
    // - Updating user settings for data sharing preferences
    // - Removing data already shared with third-party services
    // - Disabling specific data collection mechanisms
    // ...

    return res
      .status(200)
      .json({ message: `Opted out of ${sharingFeature} data sharing` });
  } catch (error) {
    logger.error(`Error opting out of data sharing: ${error.message}`);
    return res
      .status(500)
      .json({ message: 'Failed to opt out of data sharing' });
  }
});

module.exports = router;