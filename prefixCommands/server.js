const { EmbedBuilder } = require('discord.js');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'server',
    description: 'แสดงข้อมูลเซิร์ฟเวอร์',
    execute: async (message, args, client) => {
        // ข้อมูลเซิร์ฟเวอร์ทั้งหมด
        const guilds = client.guilds.cache;
        const serverCount = guilds.size;

        // คำนวณจำนวนผู้ใช้ทั้งหมด
        const totalMembers = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);

        // ข้อมูลของเซิร์ฟเวอร์ที่ใช้คำสั่ง
        const guild = message.guild;
        const owner = await guild.fetchOwner();
        const serverName = guild.name;
        const memberCount = guild.memberCount;
        const createdAt = moment(guild.createdAt).tz('Asia/Bangkok').format('DD/MM/YYYY HH:mm:ss');

        // สร้าง embed ข้อมูลเซิร์ฟเวอร์
        const embed = new EmbedBuilder()
            .setAuthor({ name: `${client.user.username} | server info`, iconURL: client.user.displayAvatarURL() })
            .setTitle('server info')
            .setDescription(`
**เซิร์ฟเวอร์ทั้งหมด:** ${serverCount}
**จำนวนผู้ใช้ทั้งหมด:** ${totalMembers}

**ข้อมูลของเซิร์ฟเวอร์นี้**
**ชื่อเซิร์ฟเวอร์:** ${serverName}
**เจ้าของเซิร์ฟเวอร์:** ${owner.user.tag}
**จำนวนผู้ใช้ทั้งหมด:** ${memberCount}
**สร้างเมื่อ:** ${createdAt}
            `)
            .setColor('#d6a3ff');

        // ส่ง embed ข้อมูลเซิร์ฟเวอร์
        await message.reply({ embeds: [embed] });
    }
};
