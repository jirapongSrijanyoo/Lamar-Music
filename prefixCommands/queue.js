const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  description: 'แสดงคิวเพลงของบอท',
  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.queue.length) {
      const embed = new EmbedBuilder()
        .setDescription("<:info:1279064953210273914>  The queue is currently empty.")
        .setColor(0xff0000);
      return message.reply({ embeds: [embed] });
    }

    const queue = player.queue.map((track, index) => `${index + 1}. ${track.title}`).join('\n');

    const embed = new EmbedBuilder()
      .setTitle("<:list:1287069880272818277> Current Queue")
      .setDescription(queue)
      .setColor("#d6a3ff");
    return message.reply({ embeds: [embed] });
  },
};
