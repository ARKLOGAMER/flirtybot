const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mission')
    .setDescription('Get a fun social challenge to build confidence'),

  /**
   * Executes the mission command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const prompt = `Create a fun, actionable social challenge that helps build real-life social confidence.
      Format: Start with "🎯 Mission:" followed by a specific, doable challenge.
      Include a brief example in parentheses.
      Focus on: character traits, positive energy, thoughtfulness, or genuine connection.
      Avoid: physical compliments, pickup lines, or anything that could be uncomfortable.
      Keep it light-hearted, encouraging, and real-world applicable.
      
      Example format:
      "🎯 Mission: Compliment someone on something non-physical today (e.g., 'You always bring good energy.')"`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.editReply({
        content: `${response}\n\n*Complete this mission today and watch your social confidence grow!*`
      });
    } catch (error) {
      console.error('Error in mission command:', error);
      await interaction.editReply('Sorry, I encountered an error while generating your mission. Please try again later!');
    }
  },
}; 