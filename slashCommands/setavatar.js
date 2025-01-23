const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-profile')
        .setDescription('เปลี่ยนโปรไฟล์ของบอท เฉพาะผู้พัฒนา')
        .addAttachmentOption(option => 
            option.setName('รูปภาพ')
                .setDescription('อัพโหลดรูปภาพเพื่อเปลี่ยนรูปโปรไฟล์ของบอท')
                .setRequired(true)),
    
    async execute(interaction) {
        const userId = 'USER_ID'; // จำกัดผู้ใช้ที่สามารถใช้คำสั่งนี้

        if (interaction.user.id !== userId) {
            return interaction.reply({ content: '<:Remove:1287071943769460759> คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
        }

        const attachment = interaction.options.getAttachment('รูปภาพ'); // รับไฟล์ที่แนบมา
        if (!attachment || !attachment.contentType.startsWith('image/')) {
            return interaction.reply({ content: '<:Remove:1287071943769460759> กรุณาอัพโหลดไฟล์รูปภาพที่ถูกต้อง', ephemeral: true });
        }

        try {
            // แจ้งให้ Discord รู้ว่าบอทกำลังดำเนินการและจะใช้เวลา
            await interaction.deferReply({ ephemeral: true });

            // เปลี่ยนรูปโปรไฟล์ของบอท
            await interaction.client.user.setAvatar(attachment.url);

            // อัปเดตข้อความเมื่อบอทเปลี่ยนรูปโปรไฟล์เสร็จแล้ว
            await interaction.editReply({ content: '<:Tick:1287071940401434654> รูปโปรไฟล์ของบอทถูกเปลี่ยนแล้ว' });
        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: '<:info:1279064953210273914> เกิดข้อผิดพลาดในการเปลี่ยนรูปโปรไฟล์ของบอท' });
        }
    },
};
