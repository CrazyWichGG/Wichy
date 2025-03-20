const loadPlayerEvents = ( player, client ) => {

    player.events.on('playerStart', (queue, track) => {
        queue.metadata.channel.send(`Started playing: **${track.title}**`);
      });
    
    player.events.on("error", (queue, error) => {
        queue.metadata.channel.send(`An error occurred while playing this song.`);
        console.error(error);
    });
    
    player.events.on("playerError", (queue, error) => {
        queue.metadata.channel.send(`An error occurred while playing this song.`);
        console.error(error);
    });
}
module.exports = loadPlayerEvents;