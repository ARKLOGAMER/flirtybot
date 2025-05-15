const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Create Discord client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Command collection
client.commands = new Collection();
// Active scenarios collection
client.activeScenarios = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// Register slash commands
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const commands = [];
    for (const file of commandFiles) {
      const command = require(`./commands/${file}`);
      commands.push(command.data.toJSON());
    }

    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();

// Handle interactions
client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
    
    // If it's a scenario or practice command, store the interaction for response handling
    if (interaction.commandName === 'scenario' || interaction.commandName === 'practice') {
      client.activeScenarios.set(interaction.user.id, {
        interaction,
        timestamp: Date.now(),
        commandName: interaction.commandName
      });
      console.log(`Started ${interaction.commandName} for user ${interaction.user.id}`);
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
});

// Handle message responses to scenarios and practice
client.on('messageCreate', async message => {
  // Ignore bot messages
  if (message.author.bot) return;
  
  // Check if user has an active scenario or practice
  const activeScenario = client.activeScenarios.get(message.author.id);
  if (!activeScenario) {
    console.log(`No active scenario for user ${message.author.id}`);
    return;
  }
  
  console.log(`Received message from user ${message.author.id} with active ${activeScenario.commandName}`);
  
  // Get the command
  const command = client.commands.get(activeScenario.commandName);
  if (!command || !command.handleResponse) {
    console.log(`No handleResponse method for command ${activeScenario.commandName}`);
    return;
  }

  // For practice command, check if conversation should continue
  if (activeScenario.commandName === 'practice') {
    if (!command.shouldContinue(activeScenario.interaction)) {
      console.log(`Practice session expired for user ${message.author.id}`);
      client.activeScenarios.delete(message.author.id);
      await message.reply('*Practice session ended due to inactivity. Start a new one with /practice!*');
      return;
    }
  } else {
    // For other commands, check the 5-minute timeout
    if (Date.now() - activeScenario.timestamp > 5 * 60 * 1000) {
      console.log(`Scenario expired for user ${message.author.id}`);
      client.activeScenarios.delete(message.author.id);
      return;
    }
  }
  
  console.log(`Processing response for user ${message.author.id}`);
  try {
    // Update the interaction's last message time
    activeScenario.interaction.conversationState = activeScenario.interaction.conversationState || {
      lastMessageTime: Date.now(),
      messageCount: 0,
      isActive: true
    };
    activeScenario.interaction.conversationState.lastMessageTime = Date.now();
    
    await command.handleResponse(activeScenario.interaction, message.content);
    
    // Only delete the scenario if it's not a practice command
    if (activeScenario.commandName !== 'practice') {
      client.activeScenarios.delete(message.author.id);
      console.log(`Scenario completed for user ${message.author.id}`);
    }
  } catch (error) {
    console.error('Error handling response:', error);
    await message.reply('Sorry, I encountered an error while processing your response. Please try again!');
  }
});

// Bot ready event
client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// Login to Discord
client.login(process.env.DISCORD_TOKEN); 