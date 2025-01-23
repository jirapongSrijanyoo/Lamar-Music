const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const formatDuration = require('../utils/formatDuration');
const moment = require('moment-timezone');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('เช็คปิงของบอท'),

    async execute(interaction) {
        const uptime = interaction.client.uptime;
        const botPing = interaction.client.ws.ping;

        const embed = new EmbedBuilder()
            .setTitle('สถานะของบอท')
            .addFields(
                { name: '<:karf:1287071262581067870> ปิงของบอท', value: `${botPing}ms`, inline: true },
                { name: '<:time:1287069814245953586> Uptime', value: formatDuration(uptime), inline: true },
                { name: '<:ago:1287071260068806666>อัพเดทล่าสุด', value: moment().tz('Asia/Bangkok').format('HH:mm:ss'), inline: false }
            )
            .setColor('#0099ff');

        const deleteButton = new ButtonBuilder()
            .setCustomId('delete')
            .setLabel('ลบข้อความ')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(deleteButton);

        // ส่งข้อความพร้อม embed และปุ่ม
        const sentMessage = await interaction.reply({ embeds: [embed], components: [row], fetchReply: true });

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
                        { name: '<:karf:1287071262581067870> ปิงของบอท', value: `${interaction.client.ws.ping}ms`, inline: true },
                        { name: '<:time:1287069814245953586> Uptime', value: formatDuration(interaction.client.uptime), inline: true },
                        { name: '<:ago:1287071260068806666> อัพเดทล่าสุด', value: moment().tz('Asia/Bangkok').format('HH:mm:ss'), inline: false }
                    )
                    .setColor('#0099ff');
                
                // อัปเดตข้อความถ้าข้อความยังไม่ถูกลบ
                await sentMessage.edit({ embeds: [updatedEmbed] });
            } catch (error) {
                console.error(`ไม่สามารถอัปเดตข้อความได้: ${error.message}`);
            }
        }, 5000);

        // สร้าง collector เพื่อจัดการกับปุ่มลบ
        const filter = i => i.customId === 'delete' && i.user.id === interaction.user.id;
        const collector = sentMessage.createMessageComponentCollector({ filter });

        collector.on('collect', async i => {
            await i.update({ content: 'ข้อความนี้ถูกลบแล้ว.', components: [] });

            // ยกเลิกการอัปเดตข้อความทุกๆ 5 วินาที
            clearInterval(interval);

            setTimeout(async () => {
                try {
                    await sentMessage.delete();
                } catch (error) {
                    console.error(`ไม่สามารถลบข้อความได้: ${error.message}`);
                }
            }, 500);
        });
    },
};
