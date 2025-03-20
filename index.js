require('dotenv').config();
const { Routes } = require('discord-api-types/v9');
const { Client, Collection, REST, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const { YoutubeiExtractor } = require("discord-player-youtubei")

const fs = require('fs');
const path = require('path');

const ENV = process.env

const loadPlayerEvents = require('./events/player');


const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildVoiceStates
    ],
});


// List of all commands
const commands = [];
client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for(const file of commandFiles) {

    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
    commands.push(command.data.toJSON());
}


// Add the player on the client
const player = new Player(client);
player.extractors.register(YoutubeiExtractor, {});


// load player events
try {
    loadPlayerEvents(player, client);
} catch(error) {
    console.error(error);
}



client.on("interactionCreate", async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if(!command) return;

    try {
        await command.execute({player, interaction});
    }
    catch(error) {
        console.error(error);
        await interaction.reply({content: "There was an error executing this command"});
    }
});



client.on("ready", () => {
  // Get all ids of the servers
  const guild_ids = client.guilds.cache.map(guild => guild.id);


  const rest = new REST({version: '9'}).setToken(ENV.TOKEN);
  for (const guildId of guild_ids) {
      rest.put(Routes.applicationGuildCommands(ENV.CLIENT_ID, guildId), 
          {body: commands})
      .then(() => console.log('Successfully updated commands for guild ' + guildId))
      .catch(console.error);
  }
  console.log('Successfully registered commands to all guilds.');
  console.log(`Logged in as ${client.user.tag}!`);
});


client.login(ENV.TOKEN);


process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error);
});