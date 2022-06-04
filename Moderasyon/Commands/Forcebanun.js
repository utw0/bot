const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("2ecc71");
  let uye = await client.users.fetch(args[0]);
  if (!args[0]) return global.send(message.channel, embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
  if (banLimitleri.get(message.author.id) >= ayar.unjail) return global.reply(message, `\`${this.configuration.name} komutu için limite ulaştın!\``);
  Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).exec((err, data) => {
    data.filter(d => (d.cezaTuru === "FORCEBAN") && (!d.bitisTarihi || d.bitisTarihi > Date.now())).forEach(d => {
      d.bitisTarihi = Date.now();
      d.save();
    });
  });
  await message.guild.members.unban(uye.id).catch();
  global.send(message.channel, "`Forceban Kaldırıldı`").catch();
  if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) global.send(client.channels.cache.find(c => c.name === ayar.banLogKanali), new MessageEmbed().setColor('ecf0f1').setTitle('Ban Kaldırıldı!').setDescription(`**Kaldıran Yetkili:** ${message.author} (${message.author.id})\n**Banı Kaldırılan Üye:** ${uye.tag} (${uye.id})`));
};
module.exports.configuration = {
  name: "unforce",
  aliases: [],
  usage: "unforce [üye]",
  description: "Belirtilen üyeyi jailden çıkarır.",
  permLevel: 1
};