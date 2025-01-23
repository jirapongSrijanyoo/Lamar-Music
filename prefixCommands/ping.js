const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const formatDuration = require('../utils/formatDuration');
const moment = require('moment-timezone');

module.exports = {
    name: 'ping',
    description: 'เช็คปิงของบอท',
    execute: async (message, args, client) => {
        const uptime = client.uptime;
        const botPing = client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('<:pc:1287069891974795315>  สถานะของบอท')
            .addFields(
                { name: 'ปิงของบอท', value: `${botPing}ms`, inline: true },
                { name: 'Uptime', value: formatDuration(uptime), inline: true },
                { name: 'อัพเดทล่าสุด', value: moment().tz('Asia/Bangkok').format('HH:mm:ss'), inline: false } //อัพเดททุก 5 วินาที จนกว่าจะลบข้คอวามหรือบอทหยุดทำงาน
            )
            .setColor('#d6a3ff');

        const deleteButton = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('ลบข้อความ')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(deleteButton);

        // ส่งข้อความเริ่มต้น
        const sentMessage = await message.reply({ embeds: [embed], components: [row] });

        // ตั้งค่า interval เพื่ออัปเดตข้อความทุกๆ 5 วินาที
        const interval = setInterval(async () => {
            try {
                // ตรวจสอบว่าข้อความถูกลบหรือยัง
                if (sentMessage.deleted) {
                    clearInterval(interval);
                    return;
                }

                const updatedEmbed = new EmbedBuilder()
                    .setTitle('สถานะของบอท')
                    .addFields(
                        { name: 'ปิงของบอท', value: `${client.ws.ping}ms`, inline: true },
                        { name: 'Uptime', value: formatDuration(client.uptime), inline: true },
                        { name: 'อัพเดทล่าสุด', value: moment().tz('Asia/Bangkok').format('HH:mm:ss'), inline: false }
                    )
                    .setColor('#0099ff');
                
                // อัปเดตข้อความ
                await sentMessage.edit({ embeds: [updatedEmbed] });
            } catch (error) {
                console.error(`ไม่สามารถอัปเดตข้อความได้: ${error.message}`);
            }
        }, 5000);

        // สร้าง collector เพื่อจัดการกับปุ่มลบ
        const filter = i => i.customId === 'delete' && i.user.id === message.author.id;
        const collector = sentMessage.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            await i.update({ content: 'ข้อความนี้ถูกลบแล้ว.', components: [] });

            // ยกเลิกการอัปเดตข้อความทุกๆ 5 วินาที
            clearInterval(interval);

            setTimeout(async () => {
                try {
                    await sentMessage.delete();
                    await message.delete();
                } catch (error) {
                    console.error(`ไม่สามารถลบข้อความได้: ${error.message}`);
                }
            }, 500);
        });
    }
};
