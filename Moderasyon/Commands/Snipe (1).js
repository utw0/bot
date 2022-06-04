const { MessageEmbed } = require("discord.js");
const snipes = require("../Models/snipe.js");

module.exports.onLoad = (client) => {
  client.on("messageDelete", async(message) => {
    if (!message.guild || message.author.bot || !message.content) return;
    await snipes.findByIdAndUpdate({ _id: message.channel.id }, { userID: message.author.id, content: message.content, createdTimestamp: message.createdTimestamp, deletedTimestamp: Date.now() }, { upsert: true });
  });
};

module.exports.execute = async(client, message, args, ayar, emoji) => {
  if (message.member.roles.highest.position < message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return;
  let snipe = await snipes.findById(message.channel.id);
  if (!snipe) return message.reply("Kanalda silinen bir mesaj verisi bulunamadı!");
  message.channel.send(new MessageEmbed().setDescription(`\`• Mesajı Yazan:\` <@${snipe.userID}> (${snipe.userID})\n\`• Mesajın Yazılma Tarihi:\` ${new Date(snipe.createdTimestamp).toTurkishFormatDate()}\n\`• Mesajın Silinme Tarihi:\` ${new Date(snipe.deletedTimestamp).toTurkishFormatDate()}\n\`• Mesaj İçeriği:\`${snipe.content.slice(0, 1000).replace(new RegExp(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi), "**Link**").replace(new RegExp(/(https:\/\/)?(www\.)?(discord\.gg|discord\.me|discordapp\.com\/invite|discord\.com\/invite)\/([a-z0-9-.]+)?/i, "g"), "**Sunucu Linki**")}${snipe.content.length > 1000 ? "... (sığmadı)" : ""}`).setTimestamp().setColor("RANDOM"));
};
module.exports.configuration = {
  name: "snipe",
  aliases: ["son-mesaj"],
  usage: "snipe",
  description: "Kanaldaki son silinen mesajı gösterir.",
  permLevel: 0
};