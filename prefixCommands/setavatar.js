module.exports = {
    name: 'setimg',
    description: 'เปลี่ยนรูปโปรไฟล์ของบอท (เฉพาะผู้พัฒนา)',
    execute: async (message, args, client) => {
        const userId = 'USER_ID'; // จำกัดผู้ใช้ที่สามารถใช้คำสั่งนี้

        if (message.author.id !== userId) {
            return message.reply('คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้');
        }

        const attachment = message.attachments.first(); // รับไฟล์ที่แนบมา
        if (!attachment || !attachment.contentType.startsWith('image/')) {
            return message.reply('กรุณาอัพโหลดไฟล์รูปภาพที่ถูกต้อง');
        }

        try {
            // เปลี่ยนรูปโปรไฟล์ของบอท
            await client.user.setAvatar(attachment.url);
            message.reply('รูปโปรไฟล์ของบอทถูกเปลี่ยนแล้ว');
        } catch (error) {
            console.error(error);
            message.reply('เกิดข้อผิดพลาดในการเปลี่ยนรูปโปรไฟล์ของบอท');
        }
    },
};
