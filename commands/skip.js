const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
          .setName("skip")
          .setDescription("Skip the song."),
    execute: async ({ player, interaction }) => {

          const queue = useQueue(interaction.guild.id);

          if (!queue) {
            return await interaction.reply("No music sessions");
          }

          if (!queue.tracks) {
            return await interaction.reply("There are no songs in the queue");
          }

          queue.node.skip();

          await interaction.reply("Skipped!");
    },
}