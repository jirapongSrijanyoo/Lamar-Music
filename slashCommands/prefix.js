const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('prefix')
    .setDescription('เปลี่ยน prefix **เฉพาะเจ้าของเซิร์ฟเวอร์และแอดมิน')
    .addStringOption(option => 
      option.setName('newprefix')
        .setDescription('คำนำหน้าใหม่')
        .setRequired(true)),

  async execute(interaction) {
    const newPrefix = interaction.options.getString('newprefix');
    const guildId = interaction.guild.id;
    const dataPath = path.join(__dirname, '../Data_Discord_server', `${guildId}.json`);
    const user = interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    try {
      let guildData = {};
      if (fs.existsSync(dataPath)) {
        guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      }

      // Check if the user is the owner or has the required role
      const isAdmin = user.id === interaction.guild.ownerId || 
                       (guildData.adminRole && member.roles.cache.some(role => guildData.adminRole.includes(role.id)));

      if (!isAdmin) {
        const noPermissionEmbed = new EmbedBuilder()
          .setTitle('Permission Denied')
          .setDescription('<:Remove:1287071943769460759> คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้!')
          .setColor(0xff0000);
        return await interaction.reply({ embeds: [noPermissionEmbed], ephemeral: true });
      }

      guildData.prefix = newPrefix;
      fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));

      const successEmbed = new EmbedBuilder()
        .setTitle('Prefix Updated')
        .setDescription(`<:Tick:1287071940401434654> เปลี่ยนคำนำหน้าเป็น \`${newPrefix}\` เรียบร้อยแล้ว!`)
        .setColor(0x00ff00);
      await interaction.reply({ embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      const errorEmbed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('<:info:1279064953210273914> เกิดข้อผิดพลาดในการเปลี่ยนคำนำหน้า')
        .setColor(0xff0000);
      await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
    }
  },
};
