const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setFooter(ayar.durum).setColor("ff0013").setTimestamp();
  if (!client.kullanabilir(message.author.id) && !ayar.yetkiayar.includes(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")) return
  let members = message.guild.roles.cache.get(ayar.enAltYetkiliRolu).members;
  let sesteOlmayanlar = members.filter(member => !member.user.bot && !member.voice.channelID);
  let yetkili = members.filter(member => !member.user.bot)

  global.send(message.channel, `Toplam Yetkili Sayısı : ${yetkili.size} || Sestte Olmayan Yetkili Sayısı : ${sesteOlmayanlar.size}`, { code: 'xl' });
  sesteOlmayanlar = sesteOlmayanlar.map(x => x.toString());
  global.send(message.channel, sesteOlmayanlar.join(', '), { code: 'xl', split: { char: ', ' } });


};
module.exports.configuration = {
  name: "yetkili-say",
  aliases: ['yetkilisay'],
  usage: "yetkili-say",
  description: "Yetkili yoklaması.",
  permLevel: 2
};