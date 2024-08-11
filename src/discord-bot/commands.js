const { SlashCommandBuilder } = require('discord.js');
const { getOpenAIService } = require('../services/openai-service');
const { logger } = require('../utils/logger');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('generate')
    .setDescription('Generates text using OpenAI')
    .addStringOption((option) =>
      option
        .setName('prompt')
        .setDescription('The prompt to use for generation')
        .setRequired(true)
    ),
  async execute(interaction) {
    try {
      const prompt = interaction.options.getString('prompt');
      const openAIService = getOpenAIService();
      const response = await openAIService.generateResponse(prompt);
      await interaction.reply(response);
    } catch (error) {
      logger.error(`Error executing generate command: ${error.message}`);
      await interaction.reply('An error occurred while generating text.');
    }
  },
};