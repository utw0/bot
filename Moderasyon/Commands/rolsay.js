const { Util, MessageEmbed } = require("discord.js")

module.exports.execute = async (client, message, args, emoji) => {
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))

    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(x => x.name.match(new RegExp(args.join(' '), 'gi')));
    if (!args[0] || !role || role.id === message.guild.id) return global.reply(message, 'rol bulunamadı, bir rol belirt!');
    global.send(message.channel, `Rol: ${role.name} | ${role.id} (${role.members.size < 1 ? 'Bu rolde hiç üye yok!' : role.members.size})`, { code: 'xl' });
    global.send(message.channel, role.members.array().map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });
};
module.exports.configuration = {
    name: 'rol-say',
    aliases: ["rolsay"],
    usage: 'role-say',
    description: 'Yetkili yoklaması.',
    permLevel: 2
};