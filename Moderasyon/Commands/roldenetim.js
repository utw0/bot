const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar,emoji) => {
  if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return global.reply(message, "`Bir rol belirtmelisin.`");
    let members = role.members.array();
    let sesteOlmayanlar = members.filter(member => !member.voice.channelID);  
    let sesteOlanlar = members.filter(member => member.voice.channel);
    global.send(message.channel, "Rol: " + role.name + " | " + role.id + " | " + role.members.size , { code: "xl", split: true });
    global.send(message.channel, sesteOlmayanlar.map((x) => x.toString()).join(', '), { code: 'xl', split: { char: ', ' } });

    client.splitEmbedWithDesc(`**🟢 Seste Olan Yetkililer**\n\n${sesteOlanlar.map(member => `${member}`).join(", ")}`,
                           {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
                           {setColor: ["2f3136"]}).then(list => {
    list.forEach(item => {
      global.send(message.channel, item)
    });
  });
  };
module.exports.configuration = {
    name: 'rol-denetim',
    aliases: [],
    usage: 'roldenetim',
    description: 'Yetkili yoklaması.',
    permLevel: 2
};