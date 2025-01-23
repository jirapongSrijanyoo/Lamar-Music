const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-nickname')
        .setDescription('เปลี่ยนชื่อของบอท เฉพาะผู้พัฒนา')
        .addStringOption(option => 
            option.setName('ชื่อเล่น')
                .setDescription('ใส่ชื่อเล่นที่ต้องการเปลี่ยน')
                .setRequired(true)),
    
    async execute(interaction) {
        const userId = 'USER_ID'; // จำกัดผู้ใช้ที่สามารถใช้คำสั่งนี้

        if (interaction.user.id !== userId) {
            return interaction.reply({ content: 'คุณไม่มีสิทธิ์ในการใช้คำสั่งนี้', ephemeral: true });
        }

        const newNickname = interaction.options.getString('ชื่อเล่น'); // รับชื่อเล่นจาก option
        let successCount = 0;
        let totalServers = 0;

        for (const guild of interaction.client.guilds.cache.values()) {
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
            .setDescription(`ชื่อเล่นของบอทถูกเปลี่ยนเป็น \`${newNickname}\` ใน ${successCount} จาก ${totalServers} เซิร์ฟเวอร์`);

        interaction.reply({ embeds: [embed], ephemeral: true }).catch(console.error); // ส่งข้อความเป็น ephemeral
    },
};
