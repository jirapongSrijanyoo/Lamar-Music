const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('ข้ามเพลงที่กำลังเล่น'),

  async execute(interaction) {
    const player = interaction.client.manager.players.get(interaction.guild.id);

    if (!player || !player.playing) {
      const embed = new EmbedBuilder()
        .setDescription('<:offline:1279064955076870186>  ไม่มีเพลงกำลังเล่นอยู่ในขณะนี้.')
        .setColor(0xff0000);
      return interaction.reply({ embeds: [embed], ephemeral: true });
    }

    // ตรวจสอบว่าเพลงถัดไปในคิวมีหรือไม่
    const nextTrack = player.queue[0];

    // ข้ามเพลงปัจจุบัน
    player.stop();

    if (nextTrack) {
      // ถ้ามีเพลงถัดไป
      const embed = new EmbedBuilder()
        .setColor('#d6a3ff')
        .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
        .setTitle('<:Tick:1287071940401434654> ข้ามเพลงสำเร็จ กำลังเล่นเพลง')
        .setDescription(`<:music:1287071622146031708> [${nextTrack.title}](${nextTrack.uri})`)
        .setFooter({ text: `Node: ${interaction.client.manager.nodes.first().options.identifier} | URL: ${nextTrack.uri}` });
      return interaction.reply({ embeds: [embed] });
    } else {
      // ไม่มีเพลงถัดไป
      const embed = new EmbedBuilder()
        .setColor('#d6a3ff')
        .setDescription('<:Tick:1287071940401434654> ข้ามเพลงสำเร็จ ไม่มีคิวเพลงเหลือ')
        .setFooter({ text: `Node: ${interaction.client.manager.nodes.first().options.identifier}` });
      return interaction.reply({ embeds: [embed] });
    }
  },
};
