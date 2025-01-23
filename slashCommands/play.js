const { SlashCommandBuilder } = require('discord.js');
const { EmbedBuilder } = require('discord.js'); // เพิ่มการนำเข้า EmbedBuilder

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('เล่นเพลงจาก URL หรือคำค้นหา')
    .addStringOption(option =>
      option.setName('search')
        .setDescription('ลิงค์เพลงหรือคำค้นหา')
        .setRequired(true)),

  async execute(interaction) {
    const search = interaction.options.getString('search');

    if (!interaction.member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:Remove:1287071943769460759> คุณต้องเข้าร่วมช่องเสียงก่อน');
      return interaction.reply({ embeds: [embed] });
    }

    if (!search) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:info:1279064953210273914> คุณต้องระบุ URL หรือคำค้นหา');
      return interaction.reply({ embeds: [embed] });
    }

    let res;

    try {
      res = await interaction.client.manager.search(search, interaction.user);

      if (res.loadType === 'empty') throw res.exception;
      if (res.loadType === 'playlist') {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('<:Remove:1287071943769460759> ไม่รองรับการเล่นเพลย์ลิสต์ด้วยคำสั่งนี้');
        return interaction.reply({ embeds: [embed] });
      }
    } catch (err) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`<:search:1287069803361734686> เกิดข้อผิดพลาดในการค้นหา: ${err.message}`);
      return interaction.reply({ embeds: [embed] });
    }

    if (res.loadType === 'error') {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('<:search:1287069803361734686> ไม่พบเพลงตามคำค้นหานั้น');
      return interaction.reply({ embeds: [embed] });
    }

    const player = interaction.client.manager.create({
      guild: interaction.guild.id,
      voiceChannel: interaction.member.voice.channel.id,
      textChannel: interaction.channel.id,
      volume: 80,
      selfMute: false,
      selfDeafen: false,
    });

    if (player.state !== 'CONNECTED') player.connect();
    player.queue.add(res.tracks[0]);

    const embed = new EmbedBuilder()
      .setColor('#d6a3ff')
      .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL() })
      .setTitle(player.queue.size > 1 ? '<:list:1287069880272818277> เพิ่มเพลงลงในคิว' : '<:music:1287071622146031708> กำลังเล่นเพลง')
      .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
      .setFooter({ text: `Node: ${interaction.client.manager.nodes.first().options.identifier} | URL: ${res.tracks[0].uri}` });

    await interaction.reply({ embeds: [embed] });

    if (!player.playing && !player.paused) player.play();
  },
};
