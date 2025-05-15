const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('study')
    .setDescription('Get personalized advice based on someone\'s profile')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('Their name (or nickname)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('interests')
        .setDescription('What are their main interests/hobbies?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('personality')
        .setDescription('How would you describe their personality?')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('context')
        .setDescription('Where/how do you know them?')
        .setRequired(true)),

  /**
   * Executes the study command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const name = interaction.options.getString('name');
      const interests = interaction.options.getString('interests');
      const personality = interaction.options.getString('personality');
      const context = interaction.options.getString('context');

      const prompt = `Analyze this person's profile and provide personalized advice for approaching them:
      Name: ${name}
      Interests: ${interests}
      Personality: ${personality}
      Context: ${context}

      Provide a structured response with:
      1. Key Conversation Topics (based on their interests)
      2. Approach Style (matching their personality)
      3. Specific Icebreakers (relevant to your context)
      4. Things to Avoid (based on their personality)
      
      Keep advice respectful, appropriate, and focused on genuine connection.`;

      const response = await askChatGPT(prompt);

      await interaction.editReply({
        content: `**Profile Analysis for ${name}**\n\n${response}\n\n*Remember: Focus on building a genuine connection based on shared interests and mutual respect.*`
      });
    } catch (error) {
      console.error('Error in study command:', error);
      await interaction.editReply('Sorry, I encountered an error while analyzing the profile. Please try again later!');
    }
  },
}; 