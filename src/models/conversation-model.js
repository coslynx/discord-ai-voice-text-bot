const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
  messages: [
    {
      timestamp: {
        type: Date,
        default: Date.now,
      },
      userMessage: {
        type: String,
        required: true,
      },
      botResponse: {
        type: String,
        required: true,
      },
    },
  ],
  context: {
    type: String,
    default: '',
  },
  feedback: {
    type: String,
    default: '',
  },
  // Add other fields as needed (e.g., conversation topic, user preferences, etc.)
});

module.exports = mongoose.model('Conversation', ConversationSchema);