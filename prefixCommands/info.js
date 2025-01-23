const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'info',
    description: 'แสดงข้อมูลของบอท',
    execute: async (message, args, client) => {
        const botAvatar = client.user.displayAvatarURL();
        const botName = client.user.username;
        const botTag = client.user.tag;
        const botUID = client.user.id;

        // สร้างลิงก์เชิญบอทอัตโนมัติ ไม่ต้องเอาลิงค์เชิญมาใส่
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${botUID}&permissions=8&scope=bot%20applications.commands`;

        // ข้อมูลของบอท เปลี่ยนตรง lavalinkNode หากใช้โหนดจากที่อื่นเปลี่ยน hostServer เป็นชื่อโฮสต์ที่เราใช้ได้
        const uid = `\`UID: ${botUID}\``;
        const nodeVersion = `\`20.14.0\``;
        const discordJsVersion = `\`14.15.3\``;
        const sakulinkVersion = `\`1.2.8\``;
        const lavalinkNode = `\`jirayu.net\``;
        const hostServer = `slamy-US, sillyDev`;
        const creator = `โค้ดสร้างบอทโดย: @loma_0531`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${botName} | info`, iconURL: botAvatar })
            .setTitle(botTag)
            .setDescription(`
${uid}
\n--- Code info ---\nNode: ${nodeVersion}\nDiscord.js: ${discordJsVersion}\nSakulink: ${sakulinkVersion}\nLavalink Node${lavalinkNode}
\n--- Host server ---\n${hostServer}
\n${creator}
            `)
            .setThumbnail(botAvatar)
            .setColor('#d6a3ff');

        // สร้างปุ่มเชิญบอท
        const inviteButton = new ButtonBuilder()
            .setLabel('เชิญบอท')
            .setURL(inviteLink)
            .setStyle(ButtonStyle.Link);

        const supportButton = new ButtonBuilder()
            .setLabel('Support')
            .setURL('https://discord.gg/cF3sXPHjzn')
            .setStyle(ButtonStyle.Link);

        const row = new ActionRowBuilder()
            .addComponents(inviteButton, supportButton);

        // ส่งข้อความตอบกลับพร้อม embed และปุ่ม
        await message.reply({ embeds: [embed], components: [row] });
    }
};
