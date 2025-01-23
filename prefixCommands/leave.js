const { EmbedBuilder } = require('discord.js');

// มีทั้งคำสั่งแบบเต็มและย่อ ใช้ได้ทั้งคู่ แนะนำว่าไม่ต้องเปลี่ยน
module.exports = {
  name: 'leave',
  aliases: ['l'],
  description: 'หยุดเล่นเพลงและออกจากช่องเสียง',
  
  async execute(message, args, client) {
    const player = client.manager.players.get(message.guild.id);

    if (!player) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('บอทไม่อยู่ในช่องเสียง');
      return message.reply({ embeds: [embed] });
    }

    if (player.state !== 'CONNECTED') {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('บอทไม่อยู่ในสถานะที่เชื่อมต่อ');
      return message.reply({ embeds: [embed] });
    }

    player.stop(); // หยุดเล่นเพลง
    player.queue.clear(); // ล้างคิวเพลง
    player.destroy(); // ลบผู้เล่นและออกจากช่องเสียง

    const embed = new EmbedBuilder()
      .setColor('#d6a3ff')
      .setDescription('บอทหยุดเล่นเพลงและออกจากช่องเสียงแล้ว');
    
    message.reply({ embeds: [embed] });
  },
};
