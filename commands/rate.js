const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rate')
    .setDescription('Rate your flirt message and get feedback')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The flirt message to rate')
        .setRequired(true)
        .setMaxLength(config.maxMessageLength)),

  /**
   * Executes the rate command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const message = interaction.options.getString('message');
      
      const prompt = `Rate this flirt message: "${message}". 
      Give a score from 1-10, classify the vibe (e.g., cringe, tryhard, smooth, charming), 
      and provide a brief constructive comment. Keep the feedback respectful and helpful.`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.editReply({
        content: `**Message Rating:**\n${response}`
      });
    } catch (error) {
      console.error('Error in rate command:', error);
      await interaction.editReply('Sorry, I encountered an error while rating your message. Please try again later!');
    }
  },
}; 