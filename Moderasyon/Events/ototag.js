const discord = require("discord.js");

module.exports = (oldUser, newUser) => {
  if(oldUser.username == newUser.username || oldUser.bot || newUser.bot) return;
  let ayarlar = global.sunucuAyar;
  let client = oldUser.client;
  let guild = client.guilds.cache.get(global.sunucuAyar.sunucuID);
  if(!guild) return console.error(`${__filename} Sunucu bulunamadı!`);
  let user = guild.members.cache.get(oldUser.id);
  if(!user) return;
  const embed = new discord.MessageEmbed().setAuthor(user.displayName, user.user.avatarURL({dynamic: true})).setColor(client.randomColor());
  let log = client.channels.cache.get("926450410556915742");

  if ((ayarlar.yasakTaglar.length && ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (ayarlar.yasakTagRolu && !user.roles.cache.has(ayarlar.yasakTagRolu))) {
    user.roles.set(user.roles.cache.has(ayarlar.boosterRolu) ? [ayarlar.boosterRolu, ayarlar.yasakTagRolu] : [ayarlar.yasakTagRolu]).catch(() => { return undefined; });
    user.setNickname(newUser.username).catch(() => { return undefined; });
    user.send(`Merhaba, **${guild.name}** sunucusunun yasaklı tag listesinde bulunan bir sunucunun tagını kullanmaktasınız. Bundan dolayı **${guild.name}** sunucusundaki kanallara erişiminiz yasaklandı ve yasaklı tag bölümü hariç hiçbir odayı göremeyeceksiniz. Eğer **${guild.name}** sunucusunda normal bir üye gibi her odaya giriş hakkını ve yazı yazma hakkını tekrardan geri kazanmak istiyorsanız tagınızı isminizden çıkartabilirsiniz.\n-**${guild.name}** sunucusunun tagını alarak sunucudaki çoğu özelliklerden yararlanabilirsiniz.\nSunucu Tagı: ${ayarlar.tag}`).catch(() => { return undefined; });
    return;
  };

  if ((ayarlar.yasakTaglar.length && !ayarlar.yasakTaglar.some(tag => newUser.username.includes(tag))) && (ayarlar.yasakTagRolu && user.roles.cache.has(ayarlar.yasakTagRolu))) {
    if (ayarlar.teyitsizRolleri) 
    user.roles.set(ayarlar.teyitsizRolleri).catch(() => { return undefined; }).catch(() => { return undefined; });
    user.send(`**${guild.name}** sunucumuzun yasaklı taglarından birine sahip olduğun için sunucuya erişimin yoktu ve şimdi bu yasaklı tagı çıkardığın için bu yasağın kalktı!`).catch(() => { return undefined; });
    if (ayarlar.teyitKanali && client.channels.cache.has(ayarlar.teyitKanali)) client.channels.cache.get(ayarlar.teyitKanali).send(`\|\| ${user} \|\|`, { embed: embed.setDescription("Yasaklı tagı bıraktığın için teşekkür ederiz! Ses kanallarından birine gelerek kayıt olabilirsin.") }).catch(() => { return undefined; });
    return;
  };

  if(newUser.username.includes(ayarlar.tag) && !user.roles.cache.has(ayarlar.ekipRolu)) {
    if (ayarlar.teyitsizRolleri.some(rol => user.roles.cache.has(rol)) || user.roles.cache.has(ayarlar.jailRolu) || user.roles.cache.has(ayarlar.yasakTagRolu)) return;
    if(ayarlar.ikinciTag.length) 
    user.setNickname(user.displayName.replace(ayarlar.ikinciTag, ayarlar.tag)).catch(() => { return undefined; });
    user.roles.add(ayarlar.ekipRolu).catch(() => { return undefined; });
    if(log) log.send(embed.setDescription(`${user} kişisi ismine \`${ayarlar.tag}\` sembolünü alarak <@&${ayarlar.ekipRolu}> ekibimize katıldı!`).setColor("#32FF00")).catch(() => { return undefined; });
    return;
  };

  if(!newUser.username.includes(ayarlar.tag) && user.roles.cache.has(ayarlar.ekipRolu)) {
    if(ayarlar.ikinciTag.length) 
    user.setNickname(user.displayName.replace(ayarlar.tag, ayarlar.ikinciTag)).catch(() => { return undefined; });
    let ekipRol = guild.roles.cache.get(ayarlar.ekipRolu);
    if (ekipRol) {
       user.roles.remove(user.roles.cache.filter(rol => ekipRol.position <= rol.position)).catch(() => { return undefined; });
    };
    if(log) log.send(embed.setDescription(`${user} kişisi isminden \`${ayarlar.tag}\` sembolünü çıkararak <@&${ayarlar.ekipRolu}> ekibimizden ayrıldı!`).setColor("#B20000")).catch(() => { return undefined; });
    return;
  };
};


module.exports.configuration = {
  name: "userUpdate"
}