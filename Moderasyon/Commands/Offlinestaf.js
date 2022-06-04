const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');

module.exports.execute = async (client, message, args, ayar, emoji) => {
     if(!client.kullanabilir(message.author.id)) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
     if(!args[0] && !args[0].includes('offline') && !args[0].includes('ses') && !args[0].includes('online')) return global.send(message.channel,"`online/ofline/ses şeklinde belirtmelisin!`").then(x => x.delete({timeout: 5000}));;
     message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);

     var enAltYetkiliRolu = message.guild.roles.cache.get(ayar.enAltYetkiliRolu);
     var members = message.guild.members.cache.filter(member => member.roles.highest.position >= enAltYetkiliRolu.position);
     let loading = await message.channel.send(`***${message.author}, Veriler hesaplanıyor...***`);
     if(args[0] && args[0].includes('offline')) {
    var offlineOlanlar = members.filter(member =>!member.user.bot && member.presence.status == "offline" && !member.voice.channelID);
    var manipuleciOclar = members.filter(member => !member.user.bot && member.presence.status == "offline" && member.voice.channelID);
    client.splitEmbedWithDesc(`**🟢 Çevrimdışı olan yetkililerr**\n\n${offlineOlanlar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.channel.send(item).catch()
    });
    client.splitEmbedWithDesc(`**🟢 Seste olup çevrimdışı takılanlar**\n\n${manipuleciOclar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.channel.send(item).catch()
    });
});
loading.delete()
});
    return;
  };
  if(args[0] && args[0].includes('ses')) {
    let sesteOlmayanlar = members.filter(member => !member.user.bot && member.presence.status != "offline" && !member.voice.channelID);
    global.send(message.channel,"Seste olmayan yetkililer" , { code: "xl", split: true });
    global.send(message.channel, `${sesteOlmayanlar.map(member => `${member}`).join(", ")}`, {split: true});
    loading.delete()

    return;
  };
  
  if (args[0] && (args[0].includes('online'))) {
    var sesteOlmayanlar = members.filter(member => !member.user.bot && member.presence.status != "offline" && !member.voice.channelID);
    var sestekiler = members.filter(member => !member.user.bot && member.presence.status != "offline" && member.voice.channelID);
    return  client.splitEmbedWithDesc(`**🟢 Seste olan yetkililer**\n\n${sestekiler.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.channel.send(item)
    });
    client.splitEmbedWithDesc(`**🟢 Akitf olup seste olmayan Yetkililer**\n\n${sesteOlmayanlar.map(member => `${member}`).join(", ")}`,
    {name: message.guild.name, icon: message.guild.iconURL({dynamic: true, size: 2048})},
    {setColor: ["2f3136"]}).then(list => { 
    list.forEach(item => {
    message.channel.send(item).catch()
    });
});
loading.delete()
});
  };

};
module.exports.configuration = {
  name: "staff",
  aliases: ["yetkili"],
  usage: "staff offline/online",
  description: "Açık veya kapalı olan yetkilileri gösterir.",
  permLevel: 0
};