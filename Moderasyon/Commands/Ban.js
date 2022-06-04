const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();
const banReasons = [
  "Dini Milli Irki Değerlere Küfü",
  "Ailevi Değerlere Küfür",
  "Kışkırtma / Hakaret",
  "Küfür",
  "Trol",
  "Siyaset",
  "Sunucu Kötüleme",
  "Chat Kanalında Spam Flood Yapmak",
  "Kadın Üyelere Rahatsız Edici Davranışlarda Bulunmak Rahatsız etmek",
  "Sorun Çözme Trolleme / Oyalama",
  "J4J",
];
module.exports.execute = async (client, message, args, ayar) => {
  let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
  if (!client.kullanabilir(message.author.id) && !ayar.banciRolleri.some(r => message.member.roles.cache.has(r))) return message.react("⛔");
  if (args[0] && args[0].includes('list')) {
    message.guild.fetchBans().then(bans => {
      message.channel.send(`# Sunucudan yasaklanmış kişiler; ⛔\n\n${bans.map(c => `${c.user.id} | ${c.user.tag}`).join("\n")}\n\n# Toplam "${bans.size}" adet yasaklanmış kullanıcı bulunuyor.`, { code: 'xl', split: true });
    });
    return;
  };

  if (args[0] && (args[0].includes('bilgi') || args[0].includes('info'))) {
    if (!args[1] || isNaN(args[1])) return global.send(message.channel, embed.setDescription(`Geçerli bir ban yemiş kullanıcı ID'si belirtmelisin!`)).then(x => x.delete({ timeout: 5000 }));;
    return message.guild.fetchBan(args.slice(1).join(' ')).then(({ user, reason }) => global.send(message.channel, embed.setDescription(`**Banlanan Üye:** ${user.tag} (${user.id})\n**Ban Sebebi:** ${reason ? reason : "Belirtilmemiş!"}`))).catch(err => global.send(message.channel, embed.setDescription("Belirtilen ID numarasına sahip bir ban bulunamadı!")).then(x => x.delete({ timeout: 5000 })));
  };

  let victim = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || await client.users.fetch(args[0]);
  
  if (banLimitleri.get(message.author.id) >= ayar.banLimit) return message.reply(`\`${this.configuration.name} komutu için limite ulaştın!\``).then(x => x.delete({ timeout: 5000 }));

  let msg = await message.channel.send(
    new MessageEmbed()
    .setDescription(`${victim} adlı kullanıcıyı hangi sebepten dolayı banlamak istiyorsunuz;\n\n${banReasons.map((r, i) => `**${i+1}.** ${r}`).join("\n")}\n\n_Lütfen ban sebebi numarasını 30 saniye içerisinde sohbete giriniz._`)
  )

  message.channel.awaitMessages(m => m.author.id === message.author.id && Number(m.content) && (Number(m.content) > 0 && Number(m.content) <= banReasons.length), { max: 1, time: 30000, errors: ['time'] })
  .then(async collected => {
    await msg.delete();
    let reason = banReasons[Number(collected.first().content)-1];
    let cezaNumara = await client.cezaNumara();
    if (!victim) {
      if (kisi) {
        message.guild.members.ban(victim.id, { reason: `Atan: ${message.author.tag} Atılma Tarihi: ${new Date(Date.now()).toTurkishFormatDate()} Sebep: `+reason  }).catch();
  
        let newPenalty = new Penalty({   
          sunucuID: message.guild.id,
          uyeID: kisi.id,
          yetkiliID: message.author.id,
          cezaTuru: "BAN",
          cezaSebebi: reason,
          atilmaTarihi: Date.now(),
          bitisTarihi: null,
        });
        newPenalty.save();
        if (client.channels.cache.find(c => c.name === ayar.banLogKanali))
          global.send(client.channels.cache.find(c => c.name === ayar.banLogKanali), new MessageEmbed().setColor('BLACK').setDescription(`Engelleyen: ${message.author} \`(${message.author.id})\`\nEngellenen: ${victim.user.tag} \`(${victim.id})\`\nSebep: ${reason}\nCezai-i İşlem: Ban \`(${cezaNumara})\``)).catch(console.error);
      } else {
        global.send(message.channel, embed.setDescription("Geçerli bir üye ve sebep belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
      };
  
    };
    if (!client.kullanabilir(message.author.id) && !ayar.banciRolleri.some(r => message.member.roles.cache.has(r))) return message.react("⛔");

    if (victim.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return global.reply(message, '`Yetkililer birbirlerini banlayamazlar.`').then(x => x.delete({ timeout: 5000 }));
    if (!victim.bannable) return global.send(message.channel, embed.setDescription("Botun yetkisi belirtilen üyeyi banlamaya yetmiyor!")).then(x => x.delete({ timeout: 5000 }));
    victim.send(embed.setDescription(`${message.author} tarafından **${reason}** sebebiyle sunucudan banlandın.`)).catch();
    message.guild.members.ban(victim.id, { reason: `Atan: ${message.author.tag} Atılma Tarihi: ${new Date(Date.now()).toTurkishFormatDate()} Sebep:`+reason }).then(x => message.react("☑️")).catch();
  
    let newPenalty = new Penalty({
      sunucuID: message.guild.id,
      uyeID: victim.id,
      yetkiliID: message.author.id,
      cezaTuru: "BAN",
      cezaSebebi: reason,
      atilmaTarihi: Date.now(),
      bitisTarihi: null,
    });
  
    global.send(message.channel, embed.setImage(ayar.banGIF).setDescription(`\`${victim.user.tag}\` isimli kullanıcı ${message.author} tarafından **${reason}** sebebiyle **Yasaklandı!**`)).then(x => x.delete({ timeout: 15000 }));
    if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) global.send(client.channels.cache.find(c => c.name === ayar.banLogKanali), new MessageEmbed().setColor('BLACK').setDescription(`Engelleyen: ${message.author} \`(${message.author.id})\`\nEngellenen: ${victim.user.tag} \`(${victim.id})\`\nSebep: ${reason}\nCezai-i İşlem: Ban \`(${cezaNumara})\``)).catch(console.error);
    newPenalty.save();
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
      banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
  } 
   setTimeout(() => {
      banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 15);
  })
  .catch(collected => msg.delete());
};
module.exports.configuration = {
  name: "yargı",
  aliases: ["ban"],
  usage: "yargı [üye] [sebep] / liste / bilgi [id]",
  description: "Belirtilen üyeyi sunucudan yasaklar.",
  permLevel: 0
};