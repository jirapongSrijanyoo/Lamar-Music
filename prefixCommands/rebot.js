const { EmbedBuilder } = require('discord.js');

const codes = new Map(); // เก็บรหัสยืนยันสำหรับผู้ใช้

module.exports = {
    name: 'rebot', // ชื่อคำสั่งหลัก
    description: '**เฉพาะผู้พัฒนา',
    execute: async (message, args, client) => {
        const authorizedUserId = '722659207958102046'; // ID ของผู้ใช้ที่สามารถใช้คำสั่งนี้ได้
        const codeLength = 4; // ความยาวของรหัส

        if (args.length === 0) {
            // ตรวจสอบว่าผู้ใช้มีสิทธิ์ใช้คำสั่งนี้
            if (message.author.id !== authorizedUserId) {
                const embed = new EmbedBuilder()
                    .setTitle('ข้อผิดพลาด')
                    .setDescription('<:Remove:1287071943769460759> คุณไม่มีสิทธิ์ใช้คำสั่งนี้!')
                    .setColor(0xff0000);

                return message.reply({ embeds: [embed] });
            }

            // สร้างรหัสสุ่ม 4 หลัก
            const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
            codes.set(message.author.id, randomCode);

            // ส่งรหัส DM ไปยังผู้ใช้
            try {
                const user = await client.users.fetch(message.author.id);
                await user.send(`<:info:1279064953210273914> กรุณาใช้รหัสนี้เพื่อรีสตาร์ทบอท: ${randomCode}`);
                const embed = new EmbedBuilder()
                    .setTitle('รีสตาร์ทบอท')
                    .setDescription('<:Tick:1287071940401434654> รหัสยืนยันได้ถูกส่งไปยัง DM ของคุณ กรุณาใช้คำสั่งนี้พร้อมกับรหัสเพื่อรีสตาร์ทบอท.')
                    .setColor('#d6a3ff');
                await message.reply({ embeds: [embed] });
            } catch (error) {
                console.error('<:info:1279064953210273914> ไม่สามารถส่ง DM ไปยังผู้ใช้:', error);
                const embed = new EmbedBuilder()
                    .setTitle('ข้อผิดพลาด')
                    .setDescription('<:Remove:1287071943769460759> ไม่สามารถส่ง DM ไปยังคุณ.')
                    .setColor(0xff0000);
                return message.reply({ embeds: [embed] });
            }
        } else {
            // ตรวจสอบรหัสที่ผู้ใช้ใส่
            if (message.author.id !== authorizedUserId) {
                const embed = new EmbedBuilder()
                    .setTitle('ข้อผิดพลาด')
                    .setDescription('<:Remove:1287071943769460759> ณไม่มีสิทธิ์ใช้คำสั่งนี้!')
                    .setColor(0xff0000);

                return message.reply({ embeds: [embed] });
            }

            const inputCode = args[0];
            const storedCode = codes.get(message.author.id);

            if (inputCode === storedCode) {
                const embed = new EmbedBuilder()
                    .setTitle('รีสตาร์ทบอท')
                    .setDescription('<:off:1287069798567645326> รหัสถูกต้อง บอทกำลังรีสตาร์ท...')
                    .setColor('#d6a3ff');
                await message.reply({ embeds: [embed] });

                codes.delete(message.author.id); // ลบรหัสหลังจากใช้แล้ว

                // รีสตาร์ทบอทโดยการออกจาก process
                process.exit(0);
            } else {
                const embed = new EmbedBuilder()
                    .setTitle('ข้อผิดพลาด')
                    .setDescription('<:Remove:1287071943769460759> รหัสยืนยันไม่ถูกต้อง.')
                    .setColor(0xff0000);
                await message.reply({ embeds: [embed] });
            }
        }
    }
};
