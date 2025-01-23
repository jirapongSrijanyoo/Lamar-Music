const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'nowplay',
  aliases: ['np'],
  description: 'แสดงเพลงที่กำลังเล่นอยู่',
  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.playing) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('ไม่มีเพลงกำลังเล่นอยู่ในขณะนี้');
      return message.reply({ embeds: [embed] });
    }

    const currentTrack = player.queue.current;

    const embed = new EmbedBuilder()
      .setColor('#d6a3ff')
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setTitle('เพลงที่กำลังเล่นอยู่')
      .setDescription(`[${currentTrack.title}](${currentTrack.uri})`)
      .setFooter({ text: `Node: ${client.manager.nodes.first().options.identifier} | URL: ${currentTrack.uri}` });

    message.reply({ embeds: [embed] });
  },
};
