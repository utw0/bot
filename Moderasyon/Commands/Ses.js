const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.array().some(rol => message.guild.roles.cache.get(ayar.enAltYetkiliRolu).rawPosition <= rol.rawPosition)) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    let embed = new MessageEmbed().setColor(client.randomColor()).setImage().setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }));


    let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if (!user) return global.send(message.channel,"Ses bilgisine bakmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene!")
    if (!user.voice.channel) return global.send(message.channel,"<@" + user.id + "> bir ses kanalına bağlı değil.")
    let mic = user.voice.selfMute == true ? "Kapalı" : "Açık"
    let hop = user.voice.selfDeaf == true ? "Kapalı" : "Açık"
    await global.send(message.channel, embed.setDescription(` ${user} kişisi <#${user.voice.channel.id}> kanalında. \n \`>\` **Mikrofonu: ${mic}\n \`>\` Kulaklığı: ${hop}**
Kanala gitmek için [tıklaman](${await user.voice.channel.createInvite({maxAge: 10 * 60 * 1000, maxUses: 1 },)}) yeterli`));
};

module.exports.configuration = {
    name: 'ses-bilgi',
    aliases: ['n', 'sesbilgi'],
    usage: 'ses-bilgi @üye',
    description: 'Belirtilen üyenin ses kanalında olup olmadığını söyler.',
    permLevel: 0
};