const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('node-status')
    .setDescription('แสดงสถานะของโหนด Lavalink'),

  async execute(interaction) {
    try {
      const node = interaction.client.manager.nodes.first();
      if (!node) return interaction.reply('❌ ไม่พบโหนดที่เชื่อมต่อ');

      // พิมพ์ข้อมูล stats ของโหนดออกมาในคอนโซล
      console.log(interaction.client.manager.nodes.stats);

      const connectedGuilds = interaction.client.manager.players.filter(player => player.connected).size;
      const activePlayers = interaction.client.manager.players.filter(player => player.playing).size;

      const embed = new EmbedBuilder()
        .setTitle('Lavalink Node Status')
        .setDescription(`<:cdplay:1287069886547361873> **โหนด:** ${node.options.identifier}\n` +
                        `<:karf:1287071262581067870> **สถานะการเชื่อมต่อ:** ${node.connected ? 'ออนไลน์' : 'ออฟไลน์'}\n` +
                        `<:music:1287071622146031708> **บอทอยู่ในห้องเสียง:** ${connectedGuilds} เซิร์ฟเวอร์\n` +
                        `<:music:1287071622146031708> **กำลังเล่นเพลงใน:** ${activePlayers} เซิร์ฟเวอร์`)
        .setColor(0xd6a3ff);

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      interaction.reply('❌ เกิดข้อผิดพลาดในการดึงข้อมูลโหนด');
    }
  },
};
