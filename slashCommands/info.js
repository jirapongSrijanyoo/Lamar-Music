const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription('แสดงข้อมูลของบอท'),
    async execute(interaction) {
        const botAvatar = interaction.client.user.displayAvatarURL();
        const botName = interaction.client.user.username;
        const botTag = interaction.client.user.tag;
        const botUID = interaction.client.user.id;

        // สร้างลิงก์เชิญบอทอัตโนมัติ
        const inviteLink = `https://discord.com/oauth2/authorize?client_id=${botUID}&permissions=8&scope=bot%20applications.commands`;

        // ข้อมูลของบอทในรูปแบบพิเศษที่มีการใช้ backticks (`) 
        const uid = `\`UID: ${botUID}\``;
        const nodeVersion = `\`20.14.0\``;
        const discordJsVersion = `\`14.15.3\``;
        const sakulinkVersion = `\`1.2.8\``;
        const lavalinkNode = `\`jirayu.net\``;
        const hostServer = `slamy-US, sillyDev`;
        const creator = `สร้างบอทโดย: @loma_0531`;

        const embed = new EmbedBuilder()
            .setAuthor({ name: `${botName} | info`, iconURL: botAvatar })
            .setTitle(botTag)
            .setDescription(`
${uid}
\n--- Code info ---\n<:node:1287075486417027153> Node: ${nodeVersion}\n<:js:1287069822487887963> Discord.js: ${discordJsVersion}\n<:js:1287069822487887963> Sakulink: ${sakulinkVersion}\n<:music:1287071622146031708> Lavalink Node${lavalinkNode}
\n--- Host server ---\n<:DB:1287069805702025348> ${hostServer}
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
        await interaction.reply({ embeds: [embed], components: [row] });
    }
};
