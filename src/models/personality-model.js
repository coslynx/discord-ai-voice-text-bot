const mongoose = require('mongoose');

const PersonalitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  tone: {
    type: String,
    enum: ['casual', 'formal', 'humorous', 'serious'],
    default: 'casual',
  },
  style: {
    type: String,
    enum: ['informative', 'creative', 'conversational', 'helpful'],
    default: 'conversational',
  },
  // Add other fields as needed, e.g., examples, prompts, etc.
});

module.exports = mongoose.model('Personality', PersonalitySchema);