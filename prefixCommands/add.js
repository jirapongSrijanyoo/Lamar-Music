const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'add',
    description: '.ให้สิทธิ์ แอดมิน กับผู้ใช้ที่มี Role นี้ **เฉพาะเจ้าของเซิร์ฟเวอร์',
    execute: async (message, args, client) => {
        // ตรวจสอบว่าเป็นเจ้าของเซิร์ฟเวอร์หรือไม่
        if (message.author.id !== message.guild.ownerId) {
            return message.reply({ content: 'คุณไม่ใช่เจ้าของเซิร์ฟเวอร์!', ephemeral: true });
        }

        // รับ role ID หรือแท็กจากคำสั่ง
        const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
        if (!role) {
            return message.reply({ content: '<:Remove:1287071943769460759> กรุณาให้ Role ID หรือแท็ก Role!', ephemeral: true });
        }

        const roleId = role.id;

        // อัพเดตข้อมูลในไฟล์
        const dataPath = path.join(__dirname, '..', 'Data_Discord_server', `${message.guild.id}.json`);
        if (fs.existsSync(dataPath)) {
            const guildData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
            if (!guildData.adminRole) {
                guildData.adminRole = [];
            }
            if (!guildData.adminRole.includes(roleId)) {
                guildData.adminRole.push(roleId);
                fs.writeFileSync(dataPath, JSON.stringify(guildData, null, 2));
                return message.reply({ content: `<:Tick:1287071940401434654> Role ID ${roleId} ถูกเพิ่มเป็นแอดมินแล้ว ผู้ใช้ที่มีบทบาทนี้จะสามารถใช้คำสั่งที่จำกัดสิทธิ์ได้.`, ephemeral: true });
            } else {
                return message.reply({ content: `<:info:1279064953210273914> Role ID ${roleId} มีอยู่ในรายการแอดมินแล้ว.`, ephemeral: true });
            }
        } else {
            return message.reply({ content: '<:search:1287069803361734686> ข้อมูลเซิร์ฟเวอร์ไม่พบ.', ephemeral: true });
        }
    }
};
