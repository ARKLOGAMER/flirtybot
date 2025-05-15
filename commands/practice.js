const { SlashCommandBuilder } = require('discord.js');
const { askChatGPT } = require('../utils/openai');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('practice')
    .setDescription('Practice your approach based on profile analysis')
    .addStringOption(option =>
      option.setName('profile')
        .setDescription('Paste the profile analysis you want to practice with')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('situation')
        .setDescription('Describe the situation you want to practice')
        .setRequired(true)),

  /**
   * Executes the practice command
   * @param {Object} interaction - The Discord interaction object
   */
  async execute(interaction) {
    await interaction.deferReply();

    try {
      const profile = interaction.options.getString('profile');
      const situation = interaction.options.getString('situation');

      const prompt = `Create a practice scenario based on this profile and situation:
      Profile Analysis:
      ${profile}
      
      Situation:
      ${situation}
      
      Create a realistic scenario that:
      1. Matches their interests and personality
      2. Is appropriate for the given situation
      3. Provides opportunities to use the suggested conversation topics
      
      Format the response as a brief scenario description followed by "What would you say next?"`;

      const response = await askChatGPT(prompt);

      // Store the profile and conversation state
      interaction.profile = profile;
      interaction.conversationState = {
        lastMessageTime: Date.now(),
        messageCount: 0,
        isActive: true,
        context: situation
      };

      await interaction.editReply({
        content: `**Practice Scenario:**\n${response}\n\n*Respond with your message, and I'll evaluate it based on the profile analysis! The conversation will continue until you stop responding for 5 minutes.*`
      });
    } catch (error) {
      console.error('Error in practice command:', error);
      await interaction.editReply('Sorry, I encountered an error while creating the practice scenario. Please try again later!');
    }
  },

  /**
   * Handles the user's response to the practice scenario
   * @param {Object} interaction - The Discord interaction object
   * @param {string} userResponse - The user's message
   */
  async handleResponse(interaction, userResponse) {
    try {
      // Update conversation state
      if (!interaction.conversationState) {
        interaction.conversationState = {
          lastMessageTime: Date.now(),
          messageCount: 0,
          isActive: true
        };
      }
      interaction.conversationState.lastMessageTime = Date.now();
      interaction.conversationState.messageCount++;

      const prompt = `Evaluate this response based on the profile analysis:
      Profile Analysis:
      ${interaction.profile}
      
      User's Response:
      "${userResponse}"
      
      Provide feedback on:
      1. How well it matches their interests
      2. If it's appropriate for their personality
      3. Whether it uses the suggested conversation topics
      4. What could be improved
      
      Then, create a natural response from the other person that:
      1. Maintains the conversation flow
      2. Shows interest in the user's message
      3. Provides an opportunity for the user to continue the conversation
      
      Format the response as:
      "**Feedback:** [Your evaluation with ✅ or ❌]
      
      **Their Response:** [Their natural response]"
      
      Keep the conversation going naturally, but end it if the user's message seems like a natural conclusion.`;

      const response = await askChatGPT(prompt);

      await interaction.followUp({
        content: `${response}\n\n*The conversation will continue until you stop responding for 5 minutes. Want to end the practice? Just don't respond for 5 minutes.*`
      });
    } catch (error) {
      console.error('Error in practice response:', error);
      await interaction.followUp({
        content: 'Sorry, I encountered an error while evaluating your response. Please try again!',
        ephemeral: true
      });
    }
  },

  /**
   * Checks if the conversation should continue
   * @param {Object} interaction - The Discord interaction object
   * @returns {boolean} Whether the conversation should continue
   */
  shouldContinue(interaction) {
    if (!interaction.conversationState) return false;
    
    const timeSinceLastMessage = Date.now() - interaction.conversationState.lastMessageTime;
    return timeSinceLastMessage < 5 * 60 * 1000; // 5 minutes
  }
}; 