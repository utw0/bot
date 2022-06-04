﻿const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
const moment = require('moment');
const ms = require('ms');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
    if (!client.kullanabilir(message.author.id) && !ayar.dcsorumlusu.some(rol => message.member.roles.cache.has(rol))) return global.send(message.channel, embed.setDescription('`Yeterli Yetkin Bulunmamakta.`')).then(x => x.delete({ timeout: 5000 }));
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye) return global.send(message.channel, embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= ayar.mutelimit) return global.reply(message, `\`${this.configuration.name} komutu için limite ulaştın!\``).then(x => x.delete({ timeout: 5000 }));
    let reason = args.splice(1).join(' ');
    if (!reason) return global.send(message.channel, embed.setDescription('Sebep belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    let msj = await message.channel.send("`Cezalandırma sistemi: 1 hafta, 2 hafta, 3 hafta olarak ayarlanmıştır`")
    const cezaNumara = await client.cezaNumara();
    const atilisTarihi = Date.now();
    await message.react("1️⃣");
    await message.react("2️⃣");
    await message.react("3️⃣");
    await message.react("☀️");

    const filter = (reaction, user) => {
        return ["1️⃣", "2️⃣","3️⃣","☀️"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collector = message.createReactionCollector(filter, { max: 1, time: 30000, error: ['time'] });
    collector.on('collect', async (reaction) => {
        if (reaction.emoji.name == "1️⃣") {
            let bitisTarihi = Date.now() + ms("7d");
            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'DC-CEZALI',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            uye.roles.add(ayar.dccezalırolu).catch(console.error);
            global.send(message.channel, embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${moment.duration(ms("7")).format('D [gün,] H [saat,] m [dakika]')}** boyunca **${reason}** nedeniyle dc ccezalıya atıldı`)).catch();
            global.send(client.channels.cache.get(ayar.dccezalılog), new MessageEmbed().setColor('f39c12').setDescription(`Engelleyen : ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye} \`(${uye.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms("7d")).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Dc Cezalı \`(${cezaNumara})\``)).catch(console.error);
            newPenalty.save();
            msj.delete()

        } else if (reaction.emoji.name == "2️⃣") {
            let bitisTarihi = Date.now() + ms("14d");

            let newPenalty = new Penalty({
                sunucuID: message.guild.id,
                uyeID: uye.id,
                yetkiliID: message.author.id,
                cezaTuru: 'DC-CEZALI',
                cezaSebebi: reason,
                atilmaTarihi: atilisTarihi,
                bitisTarihi: bitisTarihi,
            });
            global.send(message.channel, embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${moment.duration(ms("14")).format('D [gün,] H [saat,] m [dakika]')}** boyunca **${reason}** nedeniyle dc ccezalıya atıldı`)).catch();
            global.send(client.channels.cache.get(ayar.dccezalılog), new MessageEmbed().setColor('f39c12').setDescription(`Engelleyen : ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye} \`(${uye.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms("14d")).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Dc Cezalı \`(${cezaNumara})\``)).catch(console.error);
            uye.roles.add(ayar.dccezalırolu).catch(console.error);
            newPenalty.save();
            msj.delete()

    } else if (reaction.emoji.name == "3️⃣") {
        let bitisTarihi = Date.now() + ms("21d");

        let newPenalty = new Penalty({
            sunucuID: message.guild.id,
            uyeID: uye.id,
            yetkiliID: message.author.id,
            cezaTuru: 'DC-CEZALI',
            cezaSebebi: reason,
            atilmaTarihi: atilisTarihi,
            bitisTarihi: bitisTarihi,
        });
        global.send(message.channel, embed.setDescription(`${uye} üyesi, ${message.author} tarafından **${moment.duration(ms("21")).format('D [gün,] H [saat,] m [dakika]')}** boyunca **${reason}** nedeniyle dc ccezalıya atıldı`)).catch();
        global.send(client.channels.cache.get(ayar.dccezalılog), new MessageEmbed().setColor('f39c12').setDescription(`Engelleyen : ${message.author} \`(${message.author.id})\`\nEngellenen: ${uye} \`(${uye.id})\`\nSebep: ${reason}\nSüre: ${new Date(bitisTarihi).toTurkishFormatDate()} \`(${moment.duration(ms("21d")).format('D [gün,] H [saat,] m [dakika]')})\`\nCeza-i İşlem: Dc Cezalı \`(${cezaNumara})\``)).catch(console.error);
        uye.roles.add(ayar.dccezalırolu).catch(console.error);
        newPenalty.save();
        msj.delete()
  
        } else if (reaction.emoji.name == "☀️") {
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
                let cezalar = data.filter(d => (d.cezaTuru === "DC-CEZALI") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
                if (!cezalar.length) return message.reply("Veri Yok").then(x => x.delete({timeout: 5000}))
                cezalar.forEach(d => {
                    d.bitisTarihi = Date.now();
                    d.save();
    
                });
                let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
        
                await uye.roles.remove(ayar.dccezalırolu).catch();
                global.send(message.channel, embed.setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.dccezalırolu).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
                if (client.channels.cache.has(ayar.dccezalılog)) global.send(client.channels.cache.get(ayar.dccezalılog), new MessageEmbed().setColor("GREEN").setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.dccezalırolu).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
                if (cezalar[0].yetkiliID === message.author.id) return
                await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın dc cezalıyı kaldırdı.`).catch(err => undefined);
            });
        }

    });
    setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);

    collector.on('end', async () => {
        await message.reactions.removeAll();
        message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);
                msj.delete()
                if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
                    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
                }
        collector.on('error', () => message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`));
    });
};
module.exports.configuration = {
    name: 'dccezalı',
    aliases: [],
    usage: 'sesmute/mute [üye] [süre] [sebep]',
    description: 'Belirtilen üyeyi seste belirtilen süre kadar muteler.',
    permLevel: 0
};