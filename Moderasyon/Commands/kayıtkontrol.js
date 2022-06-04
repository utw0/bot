const { MessageEmbed } = require('discord.js');
const Member = require('../Models/Member.js');

module.exports.execute = async (client, message, args, conf, emoji) => {
    const embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
  
    if (!member) return global.send(message.channel, embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    Member.findOne({ guildID: message.guild.id, userID: member.user.id }, async (err, variables) => {
        if (err) return console.log(err)
        if (!variables.staffID) global.send(message.channel, embed.setDescription('Bu kullanıcıyı kayıt eden yetkili bulunamadı.')).then(x => x.delete({ timeout: 5000 }));
        let staff = await client.users.fetch(variables.staffID)
        if (!staff) global.send(message.channel, embed.setDescription('Bu kullanıcıyı kayıt eden yetkili bulunamadı.')).then(x => x.delete({ timeout: 5000 }));
        return global.send(message.channel, embed.setDescription(`Bu kullanıcıyı kayıt eden yetkili: ${staff} \`${staff.id}\``));
    })
};

module.exports.configuration = {
    name: 'kayıt-kontrol',
    aliases: ["kayıt-kontrol","kayıtkontrol","kayıtbilgi"],
    usage: 'kayıt-kontrol [üye]',
    description: 'Kayıt kontrol.',
    permLevel: 0
};