const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, conf, emoji) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(conf.boosterRolu)) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    let name = args.slice(0).join(' ');
    let isim;

    if (!name) return message.reply('Geçerli bir isim belirtmelisin.').then(x => x.delete({ timeout: 5000 }));
    if (client.chatKoruma(name) === true) return message.reply('`Bu İsmi Seçemezsin!`').then(x => x.delete({timeout: 5000}));
    isim = `${member.user.username.includes(conf.tag) ? conf.tag : conf.ikinciTag} ${name}${message.member.nickname.includes('|') ? ' |'+message.member.nickname.split('|')[1] : ''}`
    if(isim.length > 32) return message.reply('Maksimum 32 karakter sınırı var.');
    message.member.setNickname(isim);
    message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);
};

module.exports.configuration = {
    name: 'zengin',
    aliases: ['Zengin','boosterisim'],
    usage: 'zengin [isim]',
    description: 'İsminizi değiştirir.',
    permLevel: 0
};