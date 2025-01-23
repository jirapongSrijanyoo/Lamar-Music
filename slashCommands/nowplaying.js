const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('now-playing')
    .setDescription('แสดงเพลงที่กำลังเล่นอยู่'),

  async execute(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);

    if (!player || !player.playing) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:search:1287069803361734686> ไม่มีเพลงกำลังเล่นอยู่ในขณะนี้');
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    const currentTrack = player.queue.current;

    const embed = new EmbedBuilder()
      .setColor('#d6a3ff')
      .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
      .setTitle('<:music:1287071622146031708> เพลงที่กำลังเล่นอยู่')
      .setDescription(`[${currentTrack.title}](${currentTrack.uri})`)
      .setFooter({ text: `Node: ${interaction.client.manager.nodes.first().options.identifier} | URL: ${currentTrack.uri}` });

    return interaction.reply({ embeds: [embed] });
  },
};
