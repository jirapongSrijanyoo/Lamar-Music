const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'del',
    aliases: ['delete'],
    description: 'ลบข้อความตามจำนวนที่กำหนด',
    async execute(message, args) {
        const amount = parseInt(args[0]);

        if (isNaN(amount) || amount <= 0) {
            return;
        }

        try {
            const messages = await message.channel.messages.fetch({ limit: amount + 1 });
            const messagesArray = Array.from(messages.filter(m => m.id !== message.id).values());

            for (let i = 0; i < messagesArray.length && i < amount; i++) {
                try {
                    await messagesArray[i].delete();
                } catch (err) {
                    console.error(`ไม่สามารถลบข้อความได้: ${err}`);
                }
                await new Promise(resolve => setTimeout(resolve, 500)); // รอ 0.5 วินาทีระหว่างการลบแต่ละข้อความ
            }

            await message.delete(); // ลบข้อความคำสั่ง

        } catch (error) {
            console.error(`เกิดข้อผิดพลาดในการลบข้อความ: ${error}`);
        }
    }
};
