const { Client, GatewayIntentBits, Collection, REST, Routes, Events, EmbedBuilder, ActivityType } = require('discord.js');
const { Manager } = require('sakulink');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();
client.slashCommands = new Collection();

// ตรวจสอบความถูกต้องและโหลดคำสั่ง prefix commands
const validateCommands = () => {
  const commandFiles = fs.readdirSync('./prefixCommands').filter(file => file.endsWith('.js'));
  commandFiles.forEach(file => {
    try {
      const command = require(`./prefixCommands/${file}`);
      client.commands.set(command.name, command);
      if (command.aliases) {
        command.aliases.forEach(alias => client.commands.set(alias, command));
      }
      console.log(`✅  Prefix command "${command.name}" ทำงานถูกต้อง`);
    } catch (error) {
      console.error(`❌  คำสั่ง prefix command "${file}" มีข้อผิดพลาด: ${error.message}`);
    }
  });
};

// ตรวจสอบความถูกต้องและโหลดคำสั่ง slash commands
const loadSlashCommands = () => {
  const slashCommandFiles = fs.readdirSync('./slashCommands').filter(file => file.endsWith('.js'));
  const registeredCommands = new Set();  // ใช้ Set เพื่อลบคำสั่งที่ซ้ำกัน
  for (const file of slashCommandFiles) {
    try {
      const command = require(`./slashCommands/${file}`);
      if (!registeredCommands.has(command.data.name)) {
        client.slashCommands.set(command.data.name, command);
        registeredCommands.add(command.data.name);
        console.log(`✅  Slash command "${command.data.name}" ทำงานถูกต้อง`);
      }
    } catch (error) {
      console.error(`❌  slash command "${file}" has an error.: ${error.message}`);
    }
  }
};

// ลบและเพิ่มคำสั่ง slash commands ให้ใหม่ (เฉพาะ Global Commands)
const removeAndRegisterCommands = async () => {
  const rest = new REST({ version: '10' }).setToken(config.token);

  try {
    console.log('⏳  เริ่มต้นการลบคำสั่งทั้งหมด...');

    // ลบคำสั่งทั้งหมด (โกบอล)
    const globalCommands = await rest.get(Routes.applicationCommands(client.user.id));
    for (const command of globalCommands) {
      await rest.delete(Routes.applicationCommand(client.user.id, command.id));
    }

    console.log('✅  ลบคำสั่งโกลบอลสำเร็จ!!');

    // ลบคำสั่งทั้งหมด (ทุกเซิร์ฟเวอร์)
    const guilds = client.guilds.cache;
    for (const guild of guilds.values()) {
      const guildCommands = await rest.get(Routes.applicationGuildCommands(client.user.id, guild.id));
      for (const command of guildCommands) {
        await rest.delete(Routes.applicationGuildCommand(client.user.id, guild.id, command.id));
      }
    }

    console.log('✅  ลบคำสั่งทั้งหมดในทุกเซิร์ฟเวอร์สำเร็จ');

    // เพิ่มคำสั่งใหม่ (โกบอลเท่านั้น)
    const slashCommandsData = client.slashCommands.map(command => command.data.toJSON());
    await rest.put(Routes.applicationCommands(client.user.id), { body: slashCommandsData });

    console.log('✅  เพิ่มคำสั่งโกลบอลใหม่เสร็จสิ้น!!');
  } catch (error) {
    console.error('❌  Error deleting or adding command.:', error);
  }
};

// ตั้งค่า Lavalink Manager ไม่ต้องแก้ไขตรงนี้
const nodes = [{
  identifier: config.lavalink.identifier,
  host: config.lavalink.host,
  port: config.lavalink.port,
  password: config.lavalink.password,
  secure: config.lavalink.secure,
}];

client.manager = new Manager({
  shards: client.shard?.count ?? 1,
  autoPlay: true,
  defaultSearchPlatform: 'youtube music',
  nodes: nodes,
  send: (id, payload) => {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.manager.on('nodeConnect', node => {
  console.log(`Node "${node.options.identifier}" connected.`);
});

client.manager.on('nodeError', (node, error) => {
  console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`);
});

//แสดงสถานะกำหนดเองในโปรไฟล์บอท เปลี่ยนได้หากต้องการ
const activityMessages = [
  '🛠 เวอร์ชั่น 2.0.4 เบต้า',
  '📜 /รายการคำสั่ง | ดูคำสั่งทั้งหมด',
  '🔎 คลัสเตอร์: 0 | {guildCount} เซิร์ฟเวอร์',
  '📀 /เล่นเพลง | เล่นเพลง',
  '📜 Tio Project',
  '🍀 โหนด jirayu.net',
  '🧩 sakulink@v1.2.10',
  '🤍 สร้างโดย loma_0531',
];

let activityIndex = 0;

const updateActivity = async () => {
  const files = fs.readdirSync('./Data_Discord_server').filter(file => file.endsWith('.json')).length;
  const message = activityMessages[activityIndex].replace('{guildCount}', files);
  await client.user.setActivity({
    type: ActivityType.Custom,
    name: message,
  });
  activityIndex = (activityIndex + 1) % activityMessages.length;
};

client.once(Events.ClientReady, async () => {
  const { user } = client;

  // แสดงข้อความ ASCII Art ตอนบอทรัน
  console.log(`████████╗██╗ ██████╗     ██████╗ ██████╗  ██████╗      ██╗███████╗ ██████╗████████╗
╚══██╔══╝██║██╔═══██╗    ██╔══██╗██╔══██╗██╔═══██╗     ██║██╔════╝██╔════╝╚══██╔══╝
   ██║   ██║██║   ██║    ██████╔╝██████╔╝██║   ██║     ██║█████╗  ██║        ██║   
   ██║   ██║██║   ██║    ██╔═══╝ ██╔══██╗██║   ██║██   ██║██╔══╝  ██║        ██║   
   ██║   ██║╚██████╔╝    ██║     ██║  ██║╚██████╔╝╚█████╔╝███████╗╚██████╗   ██║   
   ╚═╝   ╚═╝ ╚═════╝     ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚════╝ ╚══════╝ ╚═════╝   ╚═╝`);

  if (user) {
    console.log(`||========================================||\n` +
                `||🟢  Bot is online\n` +
                `|| Logged in as : ${user.tag} \n` +
                `||========================================||\n` +
                `||📜  ©2024 Tio Project\n` +
                `||🛠  Version : 2.0.4 Beta\n` +
                `||🔎  Cluster : 0 | ${fs.readdirSync('./Data_Discord_server').filter(file => file.endsWith('.json')).length} Server\n` +
                `||🧩  Sakulink version : v1.2.10\n` +
                `||========================================||\n` +
                `|| Developed by loma_0531 🤍\n` +
                `|| Consultant : nong_mam , jirayu_sri  🤍\n` +
                `||========================================||`);
  }

  validateCommands();
  loadSlashCommands();
  await removeAndRegisterCommands();

  client.manager.init(user.id);

// อัพเดทสถานะกำหนดเองทุก 5 วินาที
  updateActivity();
  setInterval(updateActivity, 5000);

// ตรวจสอบเซิร์ฟเวอร์ที่บอทอยู่เพื่ออัพเดทไฟล์ Data ทุก 10 วินาที
  updateServerData();
  setInterval(updateServerData, 10000);
});

client.on('raw', d => client.manager.updateVoiceState(d));

// Prefix Command Handler
client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.guild) return;

  const guildId = message.guild.id;
  const dataPath = path.join(__dirname, 'Data_Discord_server', `${guildId}.json`);
  let guildData = { prefix: config.prefix }; // ใช้ prefix จาก config เป็นค่าเริ่มต้น หากใช้คำสั่งเปลี่ยน prefix เซิร์ฟเวอร์นั้นก็จะใช้ prefix ใหม่ที่เปลี่ยน ไม่ส่งผลกับ prefix หลัก

  if (fs.existsSync(dataPath)) {
    guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }

  const prefix = guildData.prefix || config.prefix;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    await command.execute(message, args, client);
  } catch (error) {
    console.error(error);
    const errorEmbed = new EmbedBuilder()
      .setTitle('Error')
      .setDescription('❌ มีข้อผิดพลาดในการรันคำสั่งนี้!')
      .setColor(0xff0000);
    message.reply({ embeds: [errorEmbed] });
  }
});

// Slash Command Handler
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const { commandName, options, guildId, user } = interaction;
  const command = client.slashCommands.get(commandName);

  if (!command) return;

  try {
    await command.execute(interaction, client); // ส่ง client เข้าไปใน execute ของคำสั่ง Slash
  } catch (error) {
    console.error(error);
    await interaction.reply({ content: 'มีข้อผิดพลาดในการรันคำสั่งนี้!', ephemeral: true });
  }
});


// ส่วนการอัพเดทไฟล์ Data ของเซิร์ฟเวอร์ สร้างไฟล์ Data ใหม่เมื่อบอทเข้าเซิร์ฟเวอร์ใหม่
const updateServerData = () => {
  const guilds = client.guilds.cache;

  guilds.forEach(guild => {
    const dataPath = path.join(__dirname, 'Data_Discord_server', `${guild.id}.json`);
    
    if (fs.existsSync(dataPath)) {
      const guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      guildData.guildId = guild.id;
      guildData.name = guild.name;
      fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));
    } else {
      const guildData = {
        guildId: guild.id,
        name: guild.name,
        roleIds: [],
        messageIds: [],
        channelIds: [],
        adminRole: [],
        yellowRoleId: "",
        orangeRoleId: "",
        musicChannelID: "",
        musicMessageID: ""
      };
      if (!fs.existsSync('Data_Discord_server')) {
        fs.mkdirSync('Data_Discord_server');
      }
      fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));
    }
  });
};

// ลบไฟล์ Data เมื่อบอทออกจากเซิร์ฟเวอร์
client.on(Events.GuildDelete, guild => {
  const filePath = path.join(__dirname, 'Data_Discord_server', `${guild.id}.json`);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log(`ข้อมูลเซิร์ฟเวอร์ ${guild.id} ถูกลบ.`);
  }
});

// ล็อกอินบอท เมื่อขึ้นข้อความ Node "ชื่อโหนด lavalink" connected. ให้รีดิสครั้งนึงในเว็บ  ctrl+F5 ในแอพ ctrl+R เพื่อให้ใช้คำสั่ง slash ได้
client.login(config.token);
