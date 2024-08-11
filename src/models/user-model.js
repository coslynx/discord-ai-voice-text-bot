const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  discriminator: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  personality: {
    type: String,
    default: 'casual',
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
  data: {
    type: Object,
  },
  anonymizedData: {
    type: Object,
  },
  // Add other fields as needed (e.g., user roles, permissions, etc.)
});

module.exports = mongoose.model('User', UserSchema);