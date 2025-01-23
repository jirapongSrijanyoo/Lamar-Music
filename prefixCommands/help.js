const { EmbedBuilder } = require('discord.js');
const config = require('../config.json'); // ดึง prefix จาก config

module.exports = {
    name: 'help', // ชื่อคำสั่งหลัก
    aliases: ['h'], // ชื่อคำสั่งย่อ
    description: 'แสดงรายการคำสั่งทั้งหมด',
    execute: async (message, args, client) => {
        const commands = client.commands;
        const addedCommands = new Set(); // เก็บชื่อคำสั่งที่ถูกเพิ่มแล้วเพื่อป้องกันการซ้ำกัน
        const commandDescriptions = [];

        // รวบรวมคำสั่งและคำอธิบาย โดยตรวจสอบว่ามีการซ้ำกันหรือไม่
        commands.forEach(command => {
            if (!addedCommands.has(command.name)) {
                let commandString = `\`${config.prefix}${command.name}\``;

                if (command.aliases) {
                    command.aliases.forEach(alias => {
                        commandString += `, \`${config.prefix}${alias}\``;
                    });
                }

                commandString += ` - ${command.description || 'ไม่มีคำอธิบาย'}`;
                commandDescriptions.push(commandString);
                addedCommands.add(command.name);
            }
        });

        // สร้าง Embed พร้อมคำสั่งที่รวบรวมได้
        const embed = new EmbedBuilder()
            .setTitle('รายการคำสั่ง')
            .setDescription('```' + commandDescriptions.join('\n') + '```')
            .setColor('#d6a3ff');

        // ส่ง Embed ไปยังช่องที่คำสั่งถูกส่งเข้ามา
        await message.reply({ embeds: [embed] });
    }
};
