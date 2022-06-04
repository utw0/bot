const { MessageEmbed } = require('discord.js');

module.exports.execute = (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
    const emoji = client.emojis.cache.find(x => x.name === "Onay").toString();
    const embed = new MessageEmbed().setColor('BLACK')//.setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));
    message.channel.send(embed.setDescription([
        `\`❯\` Ses kanallarında **${message.guild.channels.cache.filter(channel => channel.type == 'voice').map(channel => channel.members.size).reduce((a, b) => a + b)}** kişi bulunmaktadır.`,
        `\`❯\` Sunucuda **${message.guild.memberCount}** adet üye var (**${message.guild.members.cache.filter(u => u.presence.status != 'offline').size}** Aktif)`,
        `\`❯\` Toplamda **${message.guild.roles.cache.get(ayar.ekipRolu).members.size || 'Ayarlanmamış'}** kişi tagımızı alarak bizi desteklemiş.(Etiketli **${message.guild.roles.cache.get(ayar.ekipRolu).members.filter(x => x.user.discriminator.includes("0006")).size}**)`,//(Etiketli ${message.guild.roles.cache.get(ayar.ekipRolu).members.filter(x => x.user.discriminator.includes("1978")).size} Winli ${message.guild.roles.cache.get(ayar.ekipRolu).members.filter(x => x.user.username.includes("Wipe") && x.user.username.includes("wipe")).size})
        `\`❯\` Toplamda **${message.guild.premiumSubscriptionCount}** adet boost basılmış! ve sunucu **${message.guild.premiumTier}** seviye`
    ]));
    message.react(emoji)
};

module.exports.configuration = {
    name: 'say',
    aliases: ['count', 'yoklama'],
    usage: 'say',
    description: 'Sunucu sayımı.',
    permLevel: 0
};