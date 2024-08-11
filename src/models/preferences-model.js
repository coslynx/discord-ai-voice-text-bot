const mongoose = require('mongoose');

const PreferencesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  voicePreference: {
    type: String,
    default: 'en-US-Standard-A',
  },
  topicsOfInterest: [{
    type: String,
  }],
  communicationStyle: {
    type: String,
    default: 'casual',
  },
  customSettings: {
    type: Object,
    default: {},
  },
  // Add other preference fields as needed
});

module.exports = mongoose.model('Preferences', PreferencesSchema);