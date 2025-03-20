const { SlashCommandBuilder } = require("@discordjs/builders");
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
          .setName("loop")
          .setDescription("Change the loop mode."),
    execute: async ({ player, interaction }) => {

          const queue = useQueue(interaction.guild.id);

          if (!queue) {
            return await interaction.reply("No music sessions");
          }

          if (!queue.tracks) {
            return await interaction.reply("There are no songs in the queue");
          }

          if (queue.repeatMode === 0) {
            queue.setRepeatMode(2);
            await interaction.reply("Loop mode: Queue");
          }
          else if (queue.repeatMode === 2) {
            queue.setRepeatMode(0);
            await interaction.reply("Loop mode: Off");
          }
          else {
            queue.setRepeatMode(0);
            await interaction.reply("Loop mode: Off");
          }
    },
}