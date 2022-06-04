const { Client, MessageEmbed } = require('discord.js');
const { Rank } = require('canvacord');
const client = global.client = new Client({ fetchAllMembers: true });
const mongoose = require('mongoose');
const ayarlar = require('../sunucuAyar.js');
mongoose.connect(ayarlar.mongodb, { useNewUrlParser: true, useUnifiedTopology: true });
const Database = require("./xp.js");


const sayiEmojiler = {
  0: ayarlar.Number0,
  1: ayarlar.Number1,
  2: ayarlar.Number2,
  3: ayarlar.Number3,
  4: ayarlar.Number4,
  5: ayarlar.Number5,
  6: ayarlar.Number6,
  7: ayarlar.Number7,
  8: ayarlar.Number8,
  9: ayarlar.Number9
};
client.kullanabilir = function (id) {
  if (client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id).hasPermission("ADMINISTRATOR") || client.guilds.cache.get(ayarlar.sunucuID).members.cache.get(id).hasPermission("MANAGE_CHANNELS")) return true;
  return false;
};
client.emojiSayi = function (sayi) {
  var yeniMetin = '';
  var arr = Array.from(sayi);
  for (var x = 0; x < arr.length; x++) {
    yeniMetin += (sayiEmojiler[arr[x]] === '' ? arr[x] : sayiEmojiler[arr[x]]);
  }
  return yeniMetin;
};
client.on("ready", async () => {
  client.user.setPresence({ activity: { name: ayarlar.durum }, status: "iddle" });
  let botVoiceChannel = client.channels.cache.get(ayarlar.botSesKanali);
  if (botVoiceChannel) botVoiceChannel.join().catch(err => console.error("Bot ses kanalına bağlanamadı!"));

});

var prefix = ayarlar.Levelprefix;

const ayar = {
  sunucuID: ayarlar.sunucuID,
  rolOdulTur: true,
  gecersizler: ayarlar.muaf,
  rolOdul: ayarlar.leveller
};


client.seviyeYokla = async function (kisi) {
  let uye = client.guilds.cache.get(ayar.sunucuID).members.cache.get(kisi);
  let levelRolleri = ayar.rolOdul;
  let seviyeUye = await Database.findOne({ guildID: ayar.sunucuID, userID: kisi });
  if (!uye || !seviyeUye || ayarlar.muaf.includes(id => uye.id === id || uye.roles.cache.has(id))) return;
  seviyeUye = seviyeUye.lvl;
  let seviyeler = Object.keys(levelRolleri);
  if (ayar.rolOdulTur) {
    let enUstOdulu = seviyeler.filter(seviye => seviyeUye >= Number(seviye)).sort((s1, s2) => Number(s2) - Number(s1))[0];
    seviyeler.forEach((seviye, index) => {
      if (seviye == enUstOdulu && levelRolleri[seviye].some(x => !uye.roles.cache.has(x))) {
        setTimeout(async () => { await uye.roles.add(levelRolleri[seviye]); }, index * 1000);
      };
      if (seviye != enUstOdulu && levelRolleri[seviye].some(x => uye.roles.cache.has(x))) {
        setTimeout(async () => { await uye.roles.remove(levelRolleri[seviye]); }, index * 1000);
      };
    });
  } else {
    seviyeler.forEach((seviye, index) => {
      if (seviyeUye > Number(seviye) && levelRolleri[seviye].some(id => !uye.roles.cache.has(id))) {
        setTimeout(async () => { await uye.roles.add(levelRolleri[seviye]); }, index * 1000);
      };
      if (seviyeUye < Number(seviye) && levelRolleri[seviye].some(id => uye.roles.cache.has(id))) {
        setTimeout(async () => { await uye.roles.remove(levelRolleri[seviye]); }, index * 1000);
      };
    });
  };
};


client.on("message", async message => {
  if (!message || message.author.bot || !message.guild || !message.member || ayarlar.muaf.some(id => message.author.id === id || message.member.roles.cache.has(id))) return;

  let args = message.content.split(" ").slice(1);
  let command = message.content.split(" ")[0].slice(prefix.length);

  if (!message.content.startsWith(prefix)) return;
  if (!client.kullanabilir(message.author.id) && !ayarlar.commandkanali.includes(message.channel.name)) return message.reply(ayarlar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))

  if (command === "syardım") return global.send(message.channel, new MessageEmbed().setColor(message.member.displayHexColor).setTitle("Level Sistemi").setFooter(message.author.tag + " tarafından istendi!", message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(`**!seviye:** Seviye bilginizi gösterir.\n**!seviye sıralama:** Sunucudaki seviye sıralamasını gösterir.`));

  if (command === "leveltop" || command === "seviyesıralama" || command === "levelsıralama" || command === "topseviye") {
    let veriler = await Database.find({ guildID: message.guild.id });
    if (!veriler.length) return globa.reply("Herhangi bir veri bulunamadı!");
    let siralama = veriler.sort((uye1, uye2) => Number(uye2.lvl) - Number(uye1.lvl)).slice(0, 30).map((uye, index) => `\`${index + 1}.\` <@${uye.userID}> | ${uye.lvl}`).join('\n');
    return global.send(message.channel, new MessageEmbed().setColor(message.member.displayHexColor).setTitle("Top 30 Level").setFooter(message.member.displayName + " tarafından istendi!", message.author.avatarURL({ dynamic: true, size: 2048 })).setDescription(siralama));
  };
  if (command === "seviye" || command === "level") {
    let user = message.mentions.users.first() || message.author;
    if (user.bot) return globa.reply("Botların seviyesi olamaz!");
    let userData = await Database.findOne({ guildID: message.guild.id, userID: user.id }) || {};

    let members = await Database.find({ guildID: message.guild.id });
    members = members.sort((a, b) => Number(b.lvl) - Number(a.lvl)).splice(0, message.guild.memberCount).map(s => s.userID);
    const User = message.mentions.users.first() || message.author;
    const card = new Rank()
      .setUsername(User.username)
      .setDiscriminator(User.discriminator)
      .setRank(Number(members.indexOf(user.id)) + 1)
      .setLevel(userData.lvl)
      .setCurrentXP(userData.xp)
      .setRequiredXP(userData.xpToLvl)
      .setStatus(User.presence.status)
      .setAvatar(User.displayAvatarURL({ format: 'png', size: 1024 }));
    const img = await card.build();

    global.send(message.channel, { files: [{ attachment: img, name: "seviye.png" }] });
    await client.seviyeYokla(message.author.id);
    return;
  };
  if (ayarlar.muaf.includes(id => message.channel.id === id && message.author.roles.has(id))) return;
  let authorData = await Database.findOne({ guildID: message.guild.id, userID: message.author.id });
  if (!authorData) {
    let newXP = new Database({
      guildID: message.guild.id,
      userID: message.author.id,
      xp: 0,
      lvl: 0,
      xpToLvl: 0,
      renk: null,
      resim: null,
      saydamlik: null
    });
    await newXP.save();
    authorData = await Database.findOne({ guildID: message.guild.id, userID: message.author.id });
  };

  let xp = authorData.xp;
  let lvl = authorData.lvl;
  let xpToLvl = authorData.xpToLvl;

  if (!lvl) {
    xp = 20
    lvl = 1;
    xpToLvl = 100;
    authorData.xp = xp;
    authorData.lvl = lvl;
    authorData.xpToLvl = xpToLvl;
    authorData.save();
  } else {
    let random = Math.random() * (5 - 2) + 2;
    xp += Number(random.toFixed());
    authorData.xp = xp;
    if (Number(xp) <= Number(xpToLvl)) authorData.save();

    if (Number(xp) > Number(xpToLvl)) {
      lvl += 1;
      xpToLvl -= xp;
      xpToLvl += lvl * 100;
      xp = 1;
      let logKanali = client.channels.cache.find(x => x.name === ayarlar.Levellog);

      if (logKanali) {
        global.send(logKanali, `${message.author} tebrikler, seviye atladın! Yeni seviyen: **${lvl}**`)
      } else {
        globa.reply(`tebrikler, seviye atladın! Yeni seviyen: **${lvl}**`);
      };
      authorData.xp = xp;
      authorData.lvl = lvl;
      authorData.xpToLvl = xpToLvl;
      authorData.save();
      client.seviyeYokla(message.author.id);
      let rolOdulu = ayar.rolOdul[lvl];
      if (!rolOdulu) return;
      let roles = rolOdulu.filter(r => message.guild.roles.cache.has(r));
      if (!roles.length) return;
      await message.member.roles.remove(ayarlar.levelrollleri);
      await message.member.roles.add(roles);
      if (logKanali) {
        global.send(logKanali, `${message.author} tebrikler! **${lvl}.seviyeye** gelerek  \`${roles.map(r => message.guild.roles.cache.get(r).name).join(", ")}\`  rol(leri) kazandın.`);
      } else {
        global.send(message.channel, `${message.author} tebrikler! **${lvl}.seviyeye** gelerek  \`${roles.map(r => message.guild.roles.cache.get(r).name).join(", ")}\`  rol(leri) kazandın.`);
      };
    };
  };
});
const webhooks = {};
global.getWebhook = (id) => webhooks[id];
global.send = async (channel, content, options) => {
  if (webhooks[channel.id]) return (await webhooks[channel.id].send(content, options));

  let webhookss = await channel.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
    result;
  if (!wh) {
    wh = await channel.createWebhook(client.user.username, {
      avatar: client.user.avatarURL()
    });
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  } else {
    webhooks[channel.id] = wh;
    result = await wh.send(content, options);
  }
  return result;
};

global.reply = async (message, content, options) => {
  let channel = message.channel;
  if (webhooks[channel.id]) return (await webhooks[channel.id].send(`${message.author}, ${content}`, options));

  let webhookss = await channel.fetchWebhooks();
  let wh = webhookss.find(e => e.name == client.user.username),
    result;
  if (!wh) {
    wh = await channel.createWebhook(client.user.username, {
      avatar: client.user.avatarURL()
    });
    webhooks[channel.id] = wh;
    result = await wh.send(`${message.author} ${content}`, options);
  } else {
    webhooks[channel.id] = wh;
    result = await wh.send(`${message.author} ${content}`, options);
  }
  return result;
};

client.login(ayarlar.LevelBotToken).then(x => console.log(`Bot ${client.user.tag} olarak giriş yaptı!`)).catch(err => console.error("Bot giriş yapamadı | Hata: " + err));