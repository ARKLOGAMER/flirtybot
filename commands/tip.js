const { SlashCommandBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tip')
    .setDescription('Get a random social tip for better conversation'),

  /**
   * Executes the tip command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    try {
      // Get a random tip from the config
      const randomTip = config.tips[Math.floor(Math.random() * config.tips.length)];
      
      await interaction.reply({
        content: `**💡 Social Tip:**\n${randomTip}`
      });
    } catch (error) {
      console.error('Error in tip command:', error);
      await interaction.reply({
        content: 'Sorry, I encountered an error while getting a tip. Please try again later!',
        ephemeral: true
      });
    }
  },
}; 