const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('scenario')
    .setDescription('Start a dating coach scenario to practice conversation')
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of scenario')
        .setRequired(false)
        .addChoices(
          { name: 'College', value: 'college' },
          { name: 'Coffee Shop', value: 'coffee' },
          { name: 'Party', value: 'party' },
          { name: 'Random', value: 'random' }
        )),

  /**
   * Executes the scenario command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const scenarioType = interaction.options.getString('type') || 'random';
      
      const prompt = `Create a brief, realistic scenario for a dating coach simulation. 
      Scenario type: ${scenarioType}
      Format: Start with a brief situation description (1-2 sentences), then ask "What would you say next?"
      Keep it appropriate, casual, and relatable. Avoid any inappropriate or uncomfortable situations.`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.editReply({
        content: `**Dating Coach Scenario:**\n${response}\n\n*Respond with your message, and I'll give you feedback!*`
      });
    } catch (error) {
      console.error('Error in scenario command:', error);
      await interaction.editReply('Sorry, I encountered an error while creating the scenario. Please try again later!');
    }
  },

  /**
   * Handles the user's response to the scenario
   * @param {Object} interaction - The Discord interaction object
   * @param {string} userResponse - The user's message
   */
  async handleResponse(interaction, userResponse) {
    try {
      const prompt = `The user responded to a dating scenario with: "${userResponse}"
      Give a brief, constructive feedback (1-2 sentences) on their approach.
      Include a ✅ for good approaches or ❌ for approaches that need improvement.
      If the response is inappropriate or too forward, suggest a more appropriate alternative.
      Keep feedback encouraging and helpful. Focus on social skills and appropriateness.
      
      Example good feedback:
      "✅ Nice approach! Starting with a genuine observation about the environment is a great icebreaker."
      
      Example improvement feedback:
      "❌ That might be too forward. Try something more casual like commenting on the music or asking how they know the host."`;
      
      const response = await askChatGPT(prompt);
      
      await interaction.followUp({
        content: `**Coach's Feedback:**\n${response}\n\n*Want to try another scenario? Use /scenario*`
      });
    } catch (error) {
      console.error('Error in scenario response:', error);
      await interaction.followUp({
        content: 'Sorry, I encountered an error while processing your response. Please try again!',
        ephemeral: true
      });
    }
  }
}; 