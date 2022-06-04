const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
    if (banLimitleri.get(message.author.id) >= 2) return message.reply(`\`${this.configuration.name} komutu için limite ulaştın!\``);
    let kullanici = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(' ').toLowerCase())).first(): message.author) || message.author;
    let uye = message.guild.member(kullanici);
    const embed = new MessageEmbed().setColor("ffd368").setAuthor(kullanici.tag.replace('`', '')+` ( ` + message.author.id + ` )` , kullanici.avatarURL({dynamic: true, size: 2048})).setThumbnail(kullanici.avatarURL({dynamic: true, size: 2048}))
        .addField('__**Kullanıcı Bilgisi**__', `\`ID:\` ${kullanici.id}\n\`Profil:\` ${kullanici}\n\`Durum:\` ${kullanici.presence.activities[0] ? kullanici.presence.activities[0].name + ` ${(kullanici.presence.activities[0].type)}`.replace('PLAYING', 'Oynuyor').replace('STREAMING', 'Yayında').replace('LISTENING', 'Dinliyor').replace('WATCHING', 'İzliyor').replace('CUSTOM_STATUS', '') : (kullanici.presence.status).replace('offline', 'Görünmez/Çevrimdışı').replace('online', 'Çevrimiçi').replace('idle', 'Boşta').replace('dnd', 'Rahatsız Etmeyin')}\n\`Oluşturulma Tarihi:\` ${kullanici.createdAt.toTurkishFormatDate()}`);

    let yetkiliBilgisi = '';
    if(uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) {
        let teyitData = await Member.findOne({ guildID: message.guild.id, userID: uye.id });
        if (teyitData) {
            let erkekTeyit = teyitData.yetkili.get('erkekTeyit') || 0;
            let kizTeyit = teyitData.yetkili.get('kizTeyit') || 0;
            yetkiliBilgisi += `\`Teyitleri:\` ${erkekTeyit+kizTeyit} (**${erkekTeyit}** erkek, **${kizTeyit}** kiz)\n`;
        }
        let penaltiesData = await Penalty.find({ sunucuID: message.guild.id, yetkiliID: uye.id });
        let toplam = penaltiesData.length;
        let chatMute = penaltiesData.filter(c => c.cezaTuru === 'CHAT-MUTE').length;
        let sesMute = penaltiesData.filter(c => c.cezaTuru === 'VOICE-MUTE').length;
        let kick = penaltiesData.filter(c => c.cezaTuru === 'KICK').length;
        let ban = penaltiesData.filter(c => c.cezaTuru === 'BAN').length;
        let jail = penaltiesData.filter(c => c.cezaTuru === 'JAIL' || c.cezaTuru === 'TEMP-JAIL').length;
        yetkiliBilgisi += `\`Cezalandırmaları:\` ${toplam} (**${chatMute}** chat | **${sesMute}** ses mute, **${jail}** jail, **${kick}** kick, **${ban}** ban)`;
    }
    if (uye) {
        embed.addField('__**Üyelik Bilgisi**__', `\`Takma Adı:\` ${uye.displayName.replace('`', '')} ${uye.nickname ? '' : '[Yok]'}\n\`Katılma Tarihi:\` ${uye.joinedAt.toTurkishFormatDate()}\n\`Katılım Sırası:\` ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= uye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}\n\`Rolleri:\` ${uye.roles.cache.size <= 5 ? uye.roles.cache.filter(x => x.name !== '@everyone').map(x => x).join(', ') : `Listelenemedi! (${uye.roles.cache.size})`}\n${yetkiliBilgisi}`);
    }
    global.send(message.channel, embed);
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
    } 
       setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))-1);
    }, 1000*60*3);
};
module.exports.configuration = {
    name: 'istatistik',
    aliases: ['bilgi', 'i', 'me', 'user', 'info'],
    usage: 'istatistik [üye]',
    description: 'Belirtilen üyenin tüm bilgilerini gösterir.',
    permLevel: 0
};
