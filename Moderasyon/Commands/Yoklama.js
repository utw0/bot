const moment = require("moment");
require("moment-duration-format");
require("moment-timezone");

module.exports.execute = async (client, message, args, conf, emoji) => {
  const yetkililer = message.guild.members.cache.filter(member => member.roles.highest.position >= message.guild.roles.cache.get(conf.enAltYetkiliRolu).position);

  switch (args[0]) {
    case "sıfırla": {
      message.reply(`**${message.guild.members.cache.filter(x => x.roles.cache.has(conf.katildiRolu) || x.roles.cache.has(conf.katilmadiRolu)).size}** kişiden rol alınacak.`);
      message.guild.members.cache.filter(x => x.roles.cache.has(conf.katildiRolu) || x.roles.cache.has(conf.katilmadiRolu)).forEach(x => x.roles.remove([conf.katildiRolu, conf.katilmadiRolu]).catch(err => message.reply(`${x} üyesinden rol alınamadı!`)));
      message.reply("üyelerden katıldı rolü alındı, bazılarından alınmamış olabilir");
      break;
    }
    case "katıldı": {
      let log = message.guild.channels.cache.get(conf.toplantiLogKanali);
      let channel = message.guild.channels.cache.get(args[1]);
      if (!channel || channel.type != "voice") return message.reply("böyle bir kanal bulunamadı veya bu kanal ses kanalı değil!");

      channel.members.filter(x => x.id != message.author.id && !x.user.bot).forEach(x => x.roles.add(conf.katildiRolu).catch(err => message.reply(`${x} üyesine rol verilemedi!`)));

      let katılmayanŞerefsizler = message.guild.members.cache.filter(x => !x.user.bot && !x.voice.channelID && !x.roles.cache.has(conf.katildiRolu) && yetkililer.some(e => x.id == e.id));
      katılmayanŞerefsizler.forEach(x => x.roles.add(conf.katilmadiRolu).catch(err => client.reply(message, `${x} üyesine toplantı katılmadı rolü verilemedi`)));

      message.channel.send(`**${channel.name}** odasındaki **${channel.members.size}** adet üyeye toplantı rolü verildi ve loglandı!`);
      log.send(`**${moment(Date.now()).tz("Europe/Istanbul").format("YYYY.MM.DD | HH:mm:ss")}** tarihinde ${message.author} tarafından **${channel.name}** odasındaki **${channel.members.size}** adet üyeye toplantıya katıldı rolü verildi! Katılan üyeler;\n\`\`\`${channel.members.map(x => x.displayName + " / " + x.id).join("\n")}\`\`\`\n__**toplantıya katılmayan şerefsizler;**__\`\`\`\n${katılmayanŞerefsizler.map(x => x.displayName + " / " + x.id).join("\n")}\n\`\`\``, { split: true });
      break;
    } 
  }   
};   
module.exports.configuration = {
  name: 'toplantı',
  aliases: [],  
  usage: 'toplantı',
  description: 'Katıldı rolü dağıtır.',
  permLevel: 2
};