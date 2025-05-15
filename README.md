# FlirtBot 🤖💕

A fun and interactive Discord bot designed to help users improve their flirting and social conversation skills using AI-powered responses and scenarios.

## Features

- 🤖 **AI-Powered Responses**: Uses OpenAI's ChatGPT to generate natural and engaging responses
- 💬 **Interactive Scenarios**: Practice conversations in realistic dating scenarios
- 📊 **Profile Analysis**: Get personalized advice based on profile analysis
- 🎯 **Practice Mode**: Engage in continuous conversations with AI feedback
- 💡 **Social Tips**: Receive helpful tips for improving social skills
- ⭐ **Message Rating**: Get feedback on your messages and conversation starters

## Commands

- `/flirtline` - Generate a flirty message for any situation
- `/rate` - Get feedback on your message
- `/tip` - Receive a social tip
- `/scenario` - Practice a dating scenario
- `/quicktip` - Get a quick social tip
- `/mission` - Get a fun social challenge
- `/study` - Analyze a profile for conversation topics
- `/practice` - Practice conversations based on profile analysis

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/flirtbot.git
cd flirtbot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
DISCORD_TOKEN=your_discord_bot_token
OPENAI_API_KEY=your_openai_api_key
CLIENT_ID=your_discord_client_id
GUILD_ID=your_discord_guild_id
```

4. Start the bot:
```bash
node index.js
```

## Requirements

- Node.js v16.9.0 or higher
- Discord.js v14
- OpenAI API key
- Discord Bot Token

## Project Structure

```
flirtbot/
├── commands/
│   ├── flirtline.js
│   ├── rate.js
│   ├── tip.js
│   ├── scenario.js
│   ├── quicktip.js
│   ├── mission.js
│   ├── study.js
│   └── practice.js
├── utils/
│   └── openai.js
├── config.json
├── index.js
├── package.json
└── .env
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This bot is designed for entertainment and educational purposes. Always be respectful and appropriate in your interactions. 