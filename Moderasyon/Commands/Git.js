const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!uye) return global.send(message.channel, embed.setDescription('Ses odasına gidilecek üyeyi belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (!message.member.voice.channelID || !uye.voice.channelID || message.member.voice.channelID == uye.voice.channelID) return global.send(message.channel, embed.setDescription('Belirtilen üyenin ve kendinin ses kanalında olduğundan emin ol!')).then(x => x.delete({ timeout: 5000 }));
    if (client.kullanabilir(message.author.id)) {
        await message.member.voice.setChannel(uye.voice.channelID);
        message.react("✅").catch(() => {
            return undefined;
        });
    } else {
        const reactionFilter = (reaction, user) => {
            return ['✅'].includes(reaction.emoji.name) && user.id === uye.id;
        };
        message.channel.send(`${uye}`, { embed: embed.setAuthor(uye.displayName, uye.user.avatarURL({ dynamic: true, size: 2048 })).setDescription(`${message.author} senin ses kanalına girmek için izin istiyor! Onaylıyor musun?`) }).then(async msj => {
            await msj.react('✅');
            msj.awaitReactions(reactionFilter, { max: 1, time: 15000, error: ['time'] }).then(c => {
                let cevap = c.first();
                if (cevap) {
                    if (message.member.voice.channelID) message.member.voice.setChannel(uye.voice.channelID);
                    msj.delete();
                    message.react("✅").catch(() => {
                        return undefined;
                    });
                }
            }).catch(() => msj.delete());
        });
    }
};
module.exports.configuration = {
    name: 'git',
    aliases: ['go'],
    usage: 'git [üye]',
    description: 'Belirtilen üyenin ses kanalına gitmenizi sağlar.',
    permLevel: 0
};