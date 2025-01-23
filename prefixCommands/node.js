const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'node',
  description: 'แสดงสถานะของโหนด Lavalink',

  async execute(message, args, client) {
    try {
      const node = client.manager.nodes.first();
      if (!node) return message.channel.send('❌ ไม่พบโหนดที่เชื่อมต่อ');

      const connectedGuilds = client.manager.players.filter(player => player.connected).size;
      const activePlayers = client.manager.players.filter(player => player.playing).size;

      const embed = new EmbedBuilder()
        .setTitle('Lavalink Node Status')
        .setDescription(`**โหนด:** ${node.options.identifier}\n` +
                        `**สถานะการเชื่อมต่อ:** ${node.connected ? 'ออนไลน์' : 'ออฟไลน์'}\n` +
                        `**บอทอยู่ในห้องเสียง:** ${connectedGuilds} เซิร์ฟเวอร์\n` +
                        `**กำลังเล่นเพลงใน:** ${activePlayers} เซิร์ฟเวอร์`)
        .setColor(0xd6a3ff);

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      message.channel.send('เกิดข้อผิดพลาดในการดึงข้อมูลโหนด');
    }
  },
};
