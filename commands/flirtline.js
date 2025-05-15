const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');
const config = require('../config.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flirtline')
    .setDescription('Get a respectful and fun flirt line')
    .addStringOption(option =>
      option.setName('tone')
        .setDescription('The tone of the flirt line')
        .setRequired(false)
        .addChoices(
          ...config.availableTones.map(tone => ({ name: tone, value: tone }))
        )),

  /**
   * Executes the flirtline command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const tone = interaction.options.getString('tone') || config.defaultTone;
      
      const prompt = `Give me a flirty but respectful message someone could say to another person in a ${tone} tone. Keep it light-hearted, clever, and never explicit or inappropriate.`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.editReply({
        content: `**${tone.charAt(0).toUpperCase() + tone.slice(1)} Flirt Line:**\n${response}`
      });
    } catch (error) {
      console.error('Error in flirtline command:', error);
      await interaction.editReply('Sorry, I encountered an error while generating your flirt line. Please try again later!');
    }
  },
}; 