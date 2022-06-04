module.exports.execute = (client, message, args, ayar, emoji) => {
  let voiceChannel = message.member.voice.channelID;
  if (!voiceChannel) return message.reply("Herhangi bir ses kanalında değilsin!");
  let publicRooms = message.guild.channels.cache.filter(c => c.parentID === ayar.publicSesKategorisi && c.type === "voice");
  message.member.voice.channel.members.array().forEach((m, index) => {
    setTimeout(() => {
       if (m.voice.channelID !== voiceChannel) return;
       m.voice.setChannel(publicRooms.random().id);
    }, index*1000);
  });
  message.reply(`\`${message.member.voice.channel.name}\` adlı ses kanalındaki üyeler rastgele public odalara dağıtılmaya başlandı!`);
};
  
module.exports.configuration = {
  name: "dağıt",
  aliases: ["dagit", "dağit"],
  usage: "dağıt",
  description: "Komutun kullanan kişinin ses kanalındaki üyeleri rastgele ses kanallarına dağıtır.",
  permLevel: 1
};