const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'skip',
  aliases: ['sk'],
  description: 'ข้ามเพลงที่กำลังเล่น',
  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);

    if (!player || !player.playing) {
      const embed = new EmbedBuilder()
        .setDescription('<:info:1279064953210273914> ไม่มีเพลงกำลังเล่นอยู่ในขณะนี้.')
        .setColor(0xff0000);
      return message.reply({ embeds: [embed] });
    }

    // ตรวจสอบว่าเพลงถัดไปในคิวมีหรือไม่
    const nextTrack = player.queue[0];

    // ข้ามเพลงปัจจุบัน
    player.stop();

    if (nextTrack) {
      // ถ้ามีเพลงถัดไป
      const embed = new EmbedBuilder()
        .setColor('#d6a3ff')
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
        .setTitle('<:Tick:1287071940401434654> ข้ามเพลงสำเร็จ กำลังเล่นเพลง')
        .setDescription(`<:music:1287071622146031708> [${nextTrack.title}](${nextTrack.uri})`)
        .setFooter({ text: `Node: ${client.manager.nodes.first().options.identifier} | URL: ${nextTrack.uri}` });
      return message.reply({ embeds: [embed] });
    } else {
      // ไม่มีเพลงถัดไป
      const embed = new EmbedBuilder()
        .setColor('#d6a3ff')
        .setDescription('<:Tick:1287071940401434654> ข้ามเพลงสำเร็จ ไม่มีคิวเพลงเหลือ')
        .setFooter({ text: `Node: ${client.manager.nodes.first().options.identifier}` });
      return message.reply({ embeds: [embed] });
    }
  },
};
