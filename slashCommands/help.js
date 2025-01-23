const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('แสดงรายการคำสั่งทั้งหมด'),
    async execute(interaction) {
        const commands = interaction.client.slashCommands;
        const commandDescriptions = [];

        // รวบรวมคำสั่งและคำอธิบาย
        commands.forEach(command => {
            let commandString = `\`/${command.data.name}\``;
            commandString += ` - ${command.data.description || 'ไม่มีคำอธิบาย'}`;
            commandDescriptions.push(commandString);
        });

        // สร้าง Embed พร้อมคำสั่งที่รวบรวมได้
        const embed = new EmbedBuilder()
            .setTitle('รายการคำสั่ง')
            .setDescription('```' + commandDescriptions.join('\n') + '```')
            .setColor('#d6a3ff');

        // ส่ง Embed ไปยังช่องที่คำสั่งถูกส่งเข้ามา
        await interaction.reply({ embeds: [embed] });
    }
};
