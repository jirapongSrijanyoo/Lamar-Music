const fs = require('fs');
const { MessageAttachment } = require('discord.js');

module.exports = {
    name: 'setbg',
    description: 'เปลี่ยนแบนเนอร์ของบอท (เฉพาะผู้พัฒนา)',
    async execute(message, args, client) {
        // ตรวจสอบว่าเป็นผู้พัฒนา
        const developerId = 'USRE_ID'; // ใส่ id ผู้ใช้ที่จะให้ใช้คำสั่งนี้ได้
        if (message.author.id !== developerId) {
            return message.reply('คุณไม่มีสิทธิ์ใช้คำสั่งนี้');
        }

        // ตรวจสอบว่ามีการอัพโหลดไฟล์ภาพหรือไม่
        if (!message.attachments.size) {
            return message.reply('กรุณาอัพโหลดไฟล์รูปภาพที่เป็น .png, .jpg หรือ .jpeg');
        }

        const attachment = message.attachments.first();
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        
        if (!validTypes.includes(attachment.contentType)) {
            return message.reply('กรุณาอัพโหลดไฟล์รูปภาพที่เป็น .png, .jpg หรือ .jpeg');
        }

        try {
            // เปลี่ยนแบนเนอร์ของบอท
            await client.user.setBanner(attachment.url);
            return message.reply('แบนเนอร์ของบอทถูกเปลี่ยนเรียบร้อยแล้ว');
        } catch (error) {
            console.error('Error changing banner:', error);
            return message.reply('เกิดข้อผิดพลาดขณะเปลี่ยนแบนเนอร์ กรุณาลองใหม่อีกครั้ง');
        }
    },
};
