const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quicktip')
    .setDescription('Get a quick, beginner-friendly social tip'),

  /**
   * Executes the quicktip command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const prompt = `Give one short, beginner-friendly social tip for starting conversations or casual flirting.
      Format: Start with "💡 Tip:" followed by a single, actionable tip.
      Focus on: conversation starters, body language, confidence, or social awareness.
      Avoid: pickup lines, physical compliments, or anything that could be creepy.
      Keep it light-hearted, clever, and clean.
      Example format: "💡 Tip: Compliment their energy, not just their looks."`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.editReply({
        content: response
      });
    } catch (error) {
      console.error('Error in quicktip command:', error);
      await interaction.editReply('Sorry, I encountered an error while generating the tip. Please try again later!');
    }
  },
}; 