const { OpenAI } = require('openai');
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Sends a prompt to ChatGPT and returns the response
 * @param {string} prompt - The prompt to send to ChatGPT
 * @param {string} model - The model to use (default: gpt-3.5-turbo)
 * @returns {Promise<string>} The generated response
 */
async function askChatGPT(prompt, model = 'gpt-3.5-turbo') {
  try {
    const completion = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that provides respectful and appropriate flirting advice and conversation tips. Keep responses light-hearted, clever, and never explicit or inappropriate."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw new Error('Failed to generate response');
  }
}

module.exports = { askChatGPT }; 