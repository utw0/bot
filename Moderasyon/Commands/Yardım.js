const { MessageEmbed } = require("discord.js");


module.exports.execute = async (client, message, args, ayar, emoji) => {
  if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
  if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))


  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
  let command = args[0]
  if (global.commands.has(command)) {
    command = global.commands.get(command)
    embed
      .addField('Komut Adı', command.configuration.name, false)
      .addField('Komut Açıklaması', command.configuration.description, false)
      .addField('Doğru Kullanım', command.configuration.usage)
      .addField('Alternatifler', command.configuration.aliases[0] ? command.configuration.aliases.join(', ') : 'Bulunmuyor')
      .setTimestamp()
      .setColor('ff0013')
    message.channel.send(embed)
    return;
  }

  let yazı = "";
  global.commands.forEach(command => {
    yazı += `\`${ayar.prefix[0]}${command.configuration.usage}\` \n`;
  });
  message.channel.send(embed.setDescription(yazı)).then(x => x.delete({ timeout: 300000 }));
};
module.exports.configuration = {
  name: "yardım",
  aliases: ['help'],
  usage: "yardım [komut adı]",
  description: "Botta bulunan tüm komutları listeler."
};