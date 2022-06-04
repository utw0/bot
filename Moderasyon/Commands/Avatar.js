const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, [user, ...args], ayar) => {
  if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
  if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))
  
  let victim = message.mentions.users.first() || client.users.cache.get(args[0]) || (args.length > 0 ? client.users.cache.filter(e => e.username.toLowerCase().includes(args.join(" ").toLowerCase())).first() : message.author) || message.author;
  let avatar = victim.avatarURL({ dynamic: true, size: 2048 });
  let embed = new MessageEmbed()
    .setColor("RANDOM")
    .setAuthor(victim.tag, avatar)
    .setDescription(`[Resim Adresi](${avatar})`)
    .setImage(avatar)
  global.send(message.channel, embed).then(x => x.delete({ timeout: 15000 })).catch(console.error);
  message.react("☑️")
};
module.exports.configuration = {
  name: "avatar",
  aliases: ["pp"],
  usage: "avatar etiket",
  description: "kullanıcının profil resmini gösterir.",
  permLevel: 0
};