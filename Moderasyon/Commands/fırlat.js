const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let kanal = message.guild.channels.cache.get(args[1]);
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!uye || !kanal) return global.send(message.channel, embed.setDescription('Ses odana çekilecek üyeyi belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (!uye.voice.channelID || kanal == uye.voice.channelID) return global.send(message.channel, embed.setDescription('Üye zaten belirttğin kanalda ya da seste değil.')).then(x => x.delete({ timeout: 5000 }));
    if (client.kullanabilir(message.author.id)) {
        await uye.voice.setChannel(kanal).catch(() => {
            return undefined;
        });
        message.react("✅");
    } else {
        if (!ayar.transport.some(r => message.member.roles.cache.has(r))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
        let reactionFilter = (reaction, user) => ['✅'].includes(reaction.emoji.name) && user.id === uye.id;
        message.channel.send(`${uye}`, { embed: embed.setAuthor(uye.displayName, uye.user.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author} seni ses kanalına çekmek için izin istiyor! Onaylıyor musun?`) }).then(async msj => {
            await msj.react('✅');
            msj.awaitReactions(reactionFilter, { max: 1, time: 15000, error: ['time'] }).then(c => {
                let cevap = c.first();
                if (cevap) {
                    if (uye.voice.channelID) uye.voice.setChannel(kanal).catch(() => {
                        return undefined;
                    });
                    msj.delete().catch(() => {
                        return undefined;
                    });
                    message.react("✅");
                }
            }).catch(() => msj.delete());
        });
    }
};
module.exports.configuration = {
    name: 'fırlat',
    aliases: ['siktirgit'],
    usage: 'çek [üye]',
    description: 'Belirtilen üyeyi ses kanalınıza çekmeyi sağlar.',
    permLevel: 0
};