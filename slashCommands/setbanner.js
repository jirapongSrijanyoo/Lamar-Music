const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-banner')
        .setDescription('เปลี่ยนแบนเนอร์ของบอท เฉพาะผู้พัฒนา')
        .addAttachmentOption(option =>
            option.setName('ภาพ')
                .setDescription('อัพโหลดไฟล์รูปภาพที่ต้องการใช้เป็นแบนเนอร์')
                .setRequired(true)
        ),

    async execute(interaction) {
        // ตรวจสอบว่าเป็นผู้พัฒนา
        const developerId = 'USER_ID';
        if (interaction.user.id !== developerId) {
            return interaction.reply({ content: '<:Remove:1287071943769460759> คุณไม่มีสิทธิ์ใช้คำสั่งนี้', ephemeral: true });
        }

        // ดึงไฟล์รูปภาพจาก input
        const image = interaction.options.getAttachment('ภาพ');
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        
        if (!validTypes.includes(image.contentType)) {
            return interaction.reply({ content: '<:Remove:1287071943769460759> กรุณาอัพโหลดไฟล์รูปภาพที่เป็น .png, .jpg หรือ .jpeg', ephemeral: true });
        }

        try {
            // เปลี่ยนแบนเนอร์ของบอท
            await interaction.client.user.setBanner(image.url);
            return interaction.reply({ content: '<:Tick:1287071940401434654> แบนเนอร์ของบอทถูกเปลี่ยนเรียบร้อยแล้ว', ephemeral: true });
        } catch (error) {
            console.error('Error changing banner:', error);
            return interaction.reply({ content: '<:info:1279064953210273914> เกิดข้อผิดพลาดขณะเปลี่ยนแบนเนอร์ กรุณาลองใหม่อีกครั้ง', ephemeral: true });
        }
    },
};
