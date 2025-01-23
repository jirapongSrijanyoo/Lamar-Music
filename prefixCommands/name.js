const { EmbedBuilder } = require('discord.js');

// เปลี่ยนชื่อเล่นให้บอทในทุกเซิร์ฟเวอร์
module.exports = {
    name: 'name',
    description: '**เฉพาะผู้พัฒนา',
    execute: async (message, args, client) => {
        const userId = 'USER_ID'; // ใส่ ID ผู้ใช้ที่เป็นเจ้าของบอทเพื่อให้ใช้คำสั่งนี้ได้คนเดียว

        if (message.author.id !== userId) {
            return message.reply('คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้');
        }

        const newNickname = args.join(' '); // รับชื่อเล่นใหม่จาก argument
        if (!newNickname) {
            return message.reply('กรุณาใส่ชื่อเล่นที่ต้องการเปลี่ยน');
        }

        let successCount = 0;
        let totalServers = 0;

        for (const guild of client.guilds.cache.values()) {
            totalServers++;
            try {
                await guild.members.me.setNickname(newNickname);
                successCount++;
            } catch (error) {
                // ละเว้นข้อผิดพลาดสำหรับเซิร์ฟเวอร์ที่ไม่สามารถเปลี่ยนชื่อเล่นได้
            }
        }

        const embed = new EmbedBuilder()
            .setColor('#d6a3ff')
            .setTitle('เปลี่ยนชื่อเล่นสำเร็จ')
            .setDescription(`ชื่อเล่นของบอทถูกเปลี่ยนเป็น \`${newNickname}\` ${successCount} เซิร์ฟเวอร์ จาก ${totalServers} เซิร์ฟเวอร์`);

        message.author.send({ embeds: [embed] }).catch(console.error); 
    },
};
