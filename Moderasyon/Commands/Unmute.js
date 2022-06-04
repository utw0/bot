﻿
const { MessageEmbed } = require('discord.js');
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('GREEN');
    const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!client.kullanabilir(message.author.id) && (ayar.sesMuteciRolleri && !ayar.sesMuteciRolleri.some((x) => message.member.roles.cache.has(x)))) return global.send(message.channel, embed.setDescription('Bu komutu kullanabilmek için gerekli rollere sahip değilsin!')).then(x => x.delete({ timeout: 5000 }));
    if (!uye) return message.channel.send(embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (message.member.roles.highest.position <= uye.roles.highest.position) return global.send(message.channel, embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));
    if (!uye.roles.cache.has(ayar.muteRolu) && uye.voice.serverMute === false) return global.send(message.channel, embed.setDescription('Belirttiğin üyenin mutesi bulunmuyor.')).then(x => x.delete({ timeout: 5000 }));


    await message.react(`${client.emojis.cache.find(x => x.name === "chatmuteack")}`);
    await message.react(`${client.emojis.cache.find(x => x.name === "sesmuteack")}`);
    const filter = (reaction, user) => {
        return ["chatmuteack", "sesmuteack"].includes(reaction.emoji.name) && user.id === message.author.id;
    };
    const collector = message.createReactionCollector(filter, { max: 1, time: 30000, error: ['time'] });

    collector.on('collect', async (reaction) => {
        if (reaction.emoji.name == "chatmuteack") {
            if (uye.roles.cache.has(ayar.muteRolu)) uye.roles.remove(ayar.muteRolu).catch(console.error);
            if (!client.kullanabilir(message.author.id) && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))) return global.send(message.channel, embed.setDescription('`Ne yazık ki chat mute açabilecek yetkiye sahip değilsin ancak üyenin ses mutesi var ise açabilirsin.`')).then(x => x.delete({ timeout: 10000 }));
            global.send(message.channel, embed.setDescription(`${uye} üyesinin, ${message.author} tarafından mutesi kaldırıldı!`));
            global.send(client.channels.cache.find(c => c.name === ayar.muteLogKanali), new MessageEmbed().setColor('GREEN').setDescription(`Engeli Kaldıran: ${message.author} \`(${message.author.id})\`\nEngeli Kalkan: ${uye} \`(${uye.user.tag})\`\nCeza-i İşlem: Chat Mute`)).catch(console.error);
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
                let cezalar = data.filter(d => (d.cezaTuru === "CHAT-MUTE") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
                if (!cezalar.length) return message.reply("Kullanıcı bot ile mute yememiş ancak üstünde bulunan mute rolü alındı.").then(x => x.delete({timeout: 75000}))
                cezalar.forEach(async d => {
                    d.bitisTarihi = Date.now();
                    d.save();

                    banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) + 1);
                    setTimeout(() => {
                        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
                    }, 1000 * 60 * 3);
                    let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
                    if (cezalar[0].yetkiliID === message.author.id) return
                    await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın chat muteyi kaldırdı.`).catch(err => undefined);
                });
            });

        } else if (reaction.emoji.name == "sesmuteack") {
            if (uye.voice.channelID) uye.voice.setMute(false).catch(() => {
                return undefined;
            });
            global.send(message.channel, embed.setDescription(`${uye} üyesinin, ${message.author} tarafından mutesi kaldırıldı!`));
            global.send(client.channels.cache.find(c => c.name === ayar.sesMuteLogKanali), new MessageEmbed().setColor('GREEN').setDescription(`Engeli Kaldıran: ${message.author} \`(${message.author.id})\`\nEngeli Kalkan: ${uye} \`(${uye.user.tag})\`\nCeza-i İşlem: Ses Mute`)).catch(console.error);
            Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
                let cezalar = data.filter(d => (d.cezaTuru === "VOICE-MUTE") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
                if (!cezalar.length) return message.reply("Kullanıcı bot ile mute yememiş, sağtık ile atılan mute kaldırıldı.").then(x => x.delete({timeout: 75000}))
                cezalar.forEach(async d => {
                    d.bitisTarihi = Date.now();
                    d.save();

                    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
                        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
                    }
                                        setTimeout(() => {
                        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
                    }, 1000 * 60 * 3);
                    let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
                    if (cezalar[0].yetkiliID === message.author.id) return
                    await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın ses muteyi kaldırdı.`).catch(err => undefined);
                });
            });

        }

    });

    collector.on('end', async () => {
        await message.reactions.removeAll();
        message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);
        collector.on('error', () => message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`));
    });
};
module.exports.configuration = {
    name: 'unmute',
    aliases: ['unsusturma', 'susturaç', 'açsusturma', 'susturmaaç'],
    usage: 'unmute [üye]',
    description: 'Belirtilen üyenin mutesini kaldırır.',
    permLevel: 0
};