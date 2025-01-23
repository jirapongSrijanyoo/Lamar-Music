const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'play',
  aliases: ['p', '.'],
  description: 'เล่นเพลงจาก URL หรือคำค้นหา',

  async execute(message, args, client) {
    if (!message.member.voice.channel) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('คุณต้องเข้าร่วมช่องเสียงก่อน');
      return message.reply({ embeds: [embed] });
    }

    if (!args.length) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('คุณต้องระบุ URL หรือคำค้นหา');
      return message.reply({ embeds: [embed] });
    }

    const search = args.join(' ');
    let res;

    try {
      res = await client.manager.search(search, message.author);

      if (res.loadType === 'empty') throw res.exception;
      if (res.loadType === 'playlist') {
        const embed = new EmbedBuilder()
          .setColor('#ff0000')
          .setDescription('ไม่รองรับการเล่นเพลย์ลิสต์ด้วยคำสั่งนี้');
        return message.reply({ embeds: [embed] });
      }
    } catch (err) {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription(`เกิดข้อผิดพลาดในการค้นหา: ${err.message}`);
      return message.reply({ embeds: [embed] });
    }

    if (res.loadType === 'error') {
      const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setDescription('ไม่พบเพลงตามคำค้นหานั้น');
      return message.reply({ embeds: [embed] });
    }

    const player = client.manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      volume: 80,
      selfMute: false,
      selfDeafen: false,
    });

    if (player.state !== 'CONNECTED') player.connect();
    player.queue.add(res.tracks[0]);

    const embed = new EmbedBuilder()
      .setColor('#d6a3ff')
      .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL() })
      .setTitle(player.queue.size > 1 ? 'เพิ่มเพลงลงในคิว' : 'กำลังเล่นเพลง')
      .setDescription(`[${res.tracks[0].title}](${res.tracks[0].uri})`)
      .setFooter({ text: `Node: ${client.manager.nodes.first().options.identifier} | URL: ${res.tracks[0].uri}` });

    message.reply({ embeds: [embed] });

    if (!player.playing && !player.paused) player.play();
  },
};
