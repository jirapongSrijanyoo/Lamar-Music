const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'stop',
  aliases: ['pause', 'st', 'pa'],
  description: 'หยุดการเล่นเพลงชั่วคราว',
  async execute(message, args, client) {
    const guildId = message.guild.id;
    const dataPath = path.join(__dirname, '../Data_Discord_server', `${guildId}.json`);

    // ตรวจสอบไฟล์ข้อมูลเซิร์ฟเวอร์
    if (!fs.existsSync(dataPath)) {
      return message.channel.send('<:search:1287069803361734686> ไม่พบไฟล์ข้อมูลเซิร์ฟเวอร์');
    }

    const guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    const player = client.manager.players.get(guildId);

    if (!player) {
      return message.channel.send('<:info:1279064953210273914> ไม่มีเพลงที่กำลังเล่นอยู่');
    }

    if (!player.playing) {
      return message.channel.send('<:info:1279064953210273914> เพลงถูกหยุดชั่วคราวอยู่แล้ว');
    }

    player.pause(true); // หยุดเพลงชั่วคราว

    // สร้าง Embed พร้อมปุ่ม "เล่นเพลงต่อ"
    const embed = new EmbedBuilder()
      .setTitle('<:cdplay:1287069886547361873> เพลงถูกหยุดชั่วคราว')
      .setDescription(`<:music:1287071622146031708> เพลงที่กำลังเล่น: ${player.queue.current.title}`)
      .setColor('#ffcc00');

    const resumeButton = new ButtonBuilder()
      .setCustomId('resume')
      .setLabel('เล่นเพลงต่อ')
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(resumeButton);

    const sentMessage = await message.channel.send({
      embeds: [embed],
      components: [row],
    });

    // รอการกดปุ่มโดยไม่จำกัดเวลา
    const filter = i => i.customId === 'resume' && i.user.id === message.author.id;
    const collector = sentMessage.createMessageComponentCollector({ filter });

    collector.on('collect', async i => {
      if (i.customId === 'resume') {
        player.pause(false); // เล่นเพลงต่อ
        await i.update({
          embeds: [new EmbedBuilder()
            .setTitle('<:cdplay:1287069886547361873> เพลงเล่นต่อแล้ว')
            .setDescription(`<:music:1287071622146031708> กำลังเล่น: ${player.queue.current.title}`)
            .setColor('#00ff00')],
          components: [row], // ยังคงแสดงปุ่มเดิมอยู่
        });
      }
    });
  },
};
