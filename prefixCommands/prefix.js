const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'prefix',
  description: 'เปลี่ยน prefix **เฉพาะเจ้าของเซิร์ฟเวอร์และแอดมิน',
  args: true,

  async execute(message, args) {
    const newPrefix = args[0];
    const guildId = message.guild.id;
    const dataPath = path.join(__dirname, '../Data_Discord_server', `${guildId}.json`);
    const user = message.author;
    const member = message.guild.members.cache.get(user.id);

    if (!newPrefix) {
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('กรุณาระบุคำนำหน้าใหม่')
        .setColor(0xff0000);
      return message.reply({ embeds: [errorEmbed] });
    }

    try {
      let guildData = {};
      if (fs.existsSync(dataPath)) {
        guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }

      // Check if the user is the owner or has the required role
      const isAdmin = user.id === message.guild.ownerId || 
                       (guildData.adminRole && member.roles.cache.some(role => guildData.adminRole.includes(role.id)));

      if (!isAdmin) {
        const noPermissionEmbed = new EmbedBuilder()
          .setTitle('Permission Denied')
          .setDescription('คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้!')
          .setColor(0xff0000);
        return message.reply({ embeds: [noPermissionEmbed] });
      }

      guildData.prefix = newPrefix;
      fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

      const successEmbed = new EmbedBuilder()
        .setTitle('Prefix Updated')
        .setDescription(`เปลี่ยนคำนำหน้าเป็น \`${newPrefix}\` เรียบร้อยแล้ว!`)
        .setColor(0x00ff00);
      message.channel.send({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('เกิดข้อผิดพลาดในการเปลี่ยนคำนำหน้า')
        .setColor(0xff0000);
      message.channel.send({ embeds: [errorEmbed] });
    }
  },
};
