const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar,emoji) => {
  if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true})).setFooter(ayar.durum).setColor(client.randomColor()).setTimestamp();

    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role || !args[1]) return global.reply(message, "`Rol belirttikten sonra seste olmayanlara gönderilecek mesajı belirtin!`");
    let members = role.members.array();
    let sesteOlmayanlar = members.filter(member => !member.voice.channelID);
    sesteOlmayanlar.forEach(a => a.send(args.slice(1).join(' ')+("\n"+"discord.gg/"+message.guild.vanityURLCode || ayar.davet)).catch(() => undefined))
  
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
   // message.channel.send((role.members.size < 1 ? "Bu rolde hiç üye yok!" : members.map((x) => x.toString()).slice(0, members.length / 2).join(',')))
    //message.channel.send((role.members.size < 1 ? "" : members.map((x) => x.toString()).slice(members.length / 2).join(',')))

};
module.exports.configuration = {
    name: 'role-info',
    aliases: [],
    usage: 'role-info',
    description: 'Yetkili yoklaması.',
    permLevel: 2
};