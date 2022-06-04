const { MessageEmbed } = require('discord.js');
const MemberStats = require('../Models/MemberStats.js');
const Member = require('../Models/Member.js');
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async(client, message, args,ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
     if (banLimitleri.get(message.author.id) >= 3) return message.reply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
   let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    let embed = new MessageEmbed().setColor("3f0000").setAuthor(kullanici.tag.replace('`', '')+` ( ` + message.author.id + ` )` , kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}));
    let yetkiliBilgisi = '';
    if(uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) {
        let teyitData = await Member.findOne({ guildID: message.guild.id, userID: uye.id });
        if (teyitData) {
            let erkekTeyit = teyitData.yetkili.get('erkekTeyit') || 0;
            let kizTeyit = teyitData.yetkili.get('kizTeyit') || 0;
            yetkiliBilgisi += `\`Teyitleri:\` **${erkekTeyit+kizTeyit}** (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
        }
        let penaltiesData = await Penalty.find({ sunucuID: message.guild.id, yetkiliID: uye.id });
        let toplam = penaltiesData.length;
        let chatMute = penaltiesData.filter(c => c.cezaTuru === 'CHAT-MUTE').length;
        let sesMute = penaltiesData.filter(c => c.cezaTuru === 'VOICE-MUTE').length;
        let kick = penaltiesData.filter(c => c.cezaTuru === 'KICK').length;
        let ban = penaltiesData.filter(c => c.cezaTuru === 'BAN').length;
        let jail = penaltiesData.filter(c => c.cezaTuru === 'JAIL' || c.cezaTuru === 'TEMP-JAIL').length;
        yetkiliBilgisi += `\`Cezalandırmaları:\` **${toplam}**\n\`\`\`${chatMute} chat | ${sesMute} ses mute, ${jail} jail, ${kick} kick,${ban} ban\`\`\``;
    }
    MemberStats.findOne({ guildID: message.guild.id, userID: uye.id }, (err, data) => {
        if (!data) return global.send(message.channel, embed.setDescription('Belirtilen üyeye ait herhangi bir veri bulunamadı!'));
        let haftalikSesToplam = 0;
        data.voiceStats15.forEach(c => haftalikSesToplam += c);
        let haftalikSesListe = '';
        let sesmik = 0;
        data.voiceStats.forEach((value, key) => {
            sesmik+=1
            if (sesmik == 10) return;
            haftalikSesListe += `${client.emojis.cache.find(x => x.name === "mav")}\`${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\` ** ${client.convertDuration(value)}**\n`
        });
        let haftalikChatToplam = 0;
        data.chatStats15.forEach(c => haftalikChatToplam += c);
        let haftalikChatListe = '';
        let chatmik = 0;
        data.chatStats.forEach((value, key) => {
            chatmik+=1
            if (chatmik == 5) return;
            haftalikChatListe += `${client.emojis.cache.find(x => x.name === "mav")}\` ${message.guild.channels.cache.has(key) ? message.guild.channels.cache.get(key).name : 'Bilinmeyen'}:\`** ${value} mesaj**\n`
        });
        embed.addField('**Genel İstatistik**',`${client.emojis.cache.find(x => x.name === "mav")}\`Genel Toplam Ses:\` ** ${client.convertDuration(data.totalVoiceStats || 0)}**\n${client.emojis.cache.find(x => x.name === "mav")}\`Genel Toplam Chat:\` ** ${data.totalChatStats || 0} mesaj**`);
        embed.addField('Genel Ses Verileri',`${client.emojis.cache.find(x => x.name === "mav")}\`Toplam:\`  ** ${client.convertDuration(haftalikSesToplam)}** \n ${haftalikSesListe}`);
        embed.addField('Genel Chat Verileri',`${client.emojis.cache.find(x => x.name === "mav")}\`Toplam:\`  ** ${haftalikChatToplam} mesaj** \n ${haftalikChatListe}\n${yetkiliBilgisi}`);
        global.send(message.channel, embed);
        if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
            banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
        }
        setTimeout(() => {
            banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
        }, 1000*60*3);
    });
   
};
module.exports.configuration = {
    name: 'stat2',
    aliases: ['stats15','stat15', 'vinfo15', 'cinfo15'],
    usage: 'stat [üye]',
    description: 'Belirtilen üyenin tüm ses ve chat bilgilerini gösterir.',
    permLevel: 0
};