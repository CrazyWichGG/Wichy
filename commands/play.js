const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, PermissionFlagsBits } = require("discord.js");
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Play a song from YouTube.")
        .addStringOption(option =>
          option.setName("query")
            .setDescription("Enter the search terms or URL for the song")
            .setRequired(true)
      ),

    execute: async ({ player, interaction }) => {

        const vc = interaction.member.voice.channel;

        // is user in vc?
        if(!vc) {
            return await interaction.reply({content: "You must be in a voice channel to use this command."});
        }

        // is bot already in vc?
        if (interaction.guild.members.me.voice.channel && interaction.guild.members.me.voice.channel !== vc) {
            return interaction.reply('I am already playing in a different voice channel!',);
        }

        // permission check
        if (!vc.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Connect)) {
            return interaction.reply('I do not have permission to join your voice channel!',);
        }
       
        if (!vc.permissionsFor(interaction.guild.members.me).has(PermissionFlagsBits.Speak)) {
            return interaction.reply('I do not have permission to speak in your voice channel!',);
        }

        const query = interaction.options.getString("query"); 


        const queue = player.nodes.create(interaction.guild.id, {voiceChannel: vc});
        const result = await player.search(query);

        fs.writeFile("output/result.json", JSON.stringify(result, null, 2), (err) => {});
        

        const entry = queue.tasksQueue.acquire();

        await entry.getTask();

        queue.addTrack(result.tracks[0]);
        

        try {
            if (!queue.connection) await queue.connect(vc);
            if (!queue.isPlaying()) queue.node.play();
        } catch(error) {
            console.error(error);
            return await interaction.reply({content: "There was an error playing this song."});
        } finally {
            queue.tasksQueue.release();
        }
    },
};
