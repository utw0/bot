const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
const client = global.client;

module.exports = () => {
  setInterval(async () => {
    await checkRoles();
  }, 60000);
};

module.exports.configuration = {
  name: "ready"
};

async function checkRoles() {
  let ayar = global.sunucuAyar;
  let yasaklitag = global.yasaklitag;
  let guild = client.guilds.cache.get(ayar.sunucuID);
  let yasakTaglar = yasaklitag.taglar;
  let ekipRol = guild.roles.cache.get(ayar.enAltYetkiliRolu);
 

  guild.members.cache.filter(uye => uye.user.username.includes(ayar.tag)  || uye.user.discriminator.includes("1937") || uye.user.username.includes("Wily") || uye.user.username.includes("wily") || uye.user.username.includes("WİLY") && !ayar.teyitsizRolleri.some(r => uye.roles.cache.has(r)) && !uye.roles.cache.has(ayar.fakeHesapRolu) && !uye.roles.cache.has(ayar.jailRolu) && !uye.roles.cache.has(ayar.yasakTagRolu) && !uye.roles.cache.has(ayar.ekipRolu)).array().forEach( async (uye, index) => {
    if(uye.hasPermission("MANAGE_CHANNELS") && uye.hasPermission("ADMINISTRATOR")) return
    if(uye.user.bot) return
    uye.roles.add(ayar.ekipRolu);
    return;
});

guild.members.cache.filter(x => !x.user.username.includes(ayar.tag) && !x.user.discriminator.includes("1937") &&  !x.user.username.includes("Wily") &&  !x.user.username.includes("wily") && !x.user.username.includes("WİLY") && !ayar.vipRole.some(r => x.roles.cache.has(r)) && !ayar.teyitsizRolleri.some(r => x.roles.cache.has(r))   && !x.roles.cache.has(ayar.fakeHesapRolu) && !x.roles.cache.has(ayar.jailRolu) && x.roles.cache.has(ayar.ekipRolu) && !x.roles.cache.has(ayar.yasakTagRolu)).array().forEach( async (x, index) => {
    if(x.hasPermission("MANAGE_CHANNELS") && x.hasPermission("ADMINISTRATOR")) return
    if(x.user.bot) return
    x.roles.remove(ayar.ekipRolu);
});
  guild.members.cache.filter(uye => uye.roles.cache.size === 1).array().forEach((uye, index) => setTimeout(() => {
     uye.roles.add(ayar.teyitsizRolleri).catch();
     }, index * 15000))
    // Yasak tagı olanlara yasak tag rolü verme
    guild.members.cache.filter(uye => yasakTaglar.some(tag => uye.user.username.includes(tag)) && uye.roles.cache.has(ayar.jailRolu) && !uye.roles.cache.has(ayar.yasakTagRolu) && !ayar.vipRole.some(x => uye.roles.cache.has(x)) && !uye.roles.cache.has(ayar.boosterRolu)).array().forEach((uye, index) => {
      uye.roles.set(ayar.yasakTagRolu)
     // uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ayar.yasakTagRolu.concat(ayar.boosterRolu) : ayar.yasakTagRolu).catch(console.error); 
     });
      // Yasak tagı olmayıp yasak tag rolü olan üyelerden rolü alma
      guild.members.cache.filter(uye => !yasakTaglar.some(tag => uye.user.username.includes(tag)) && uye.roles.cache.has(ayar.yasakTagRolu)).array().forEach((uye, index) => {
        uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ayar.teyitsizRolleri.concat(ayar.boosterRolu) : ayar.teyitsizRolleri).catch(console.error);  });

  let Penalties = await Penalty.find({ sunucuID: guild.id });
  Penalties = Penalties.filter(p => guild.members.cache.has(p.uyeID) && p.cezaTuru !== "BAN" && p.cezaTuru !== "KICK");
  let bitmisCezalar = Penalties.filter(p => p.bitisTarihi && p.bitisTarihi < Date.now());
  let surenCezalar = Penalties.filter(p => !p.bitisTarihi || p.bitisTarihi > Date.now());
  for (let i = 0; i < surenCezalar.length; i++) {
    let surenCeza = surenCezalar[i];
    if (!surenCeza) return;
    let uye = guild.members.cache.get(surenCeza.uyeID);
    if ((surenCeza.cezaTuru === "JAIL" || surenCeza.cezaTuru === "TEMP-JAIL") && !uye.roles.cache.has(ayar.jailRolu)) {
      if (!uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? [ayar.boosterRolu, ayar.jailRolu] : [ayar.jailRolu]).catch(console.error);;
    };
    if ((surenCeza.cezaTuru === "FORCEBAN") && !uye.roles.cache.has(ayar.jailRolu)) {
      if (!uye.roles.cache.has(ayar.jailRolu))   uye.ban({ reason: "Forceban Algılandı." });
    };
    if (surenCeza.cezaTuru === "CHAT-MUTE" && !uye.roles.cache.has(ayar.muteRolu)) {
      if (!uye.roles.cache.has(ayar.muteRolu)) uye.roles.add(ayar.muteRolu).catch(console.error);
    };
    if (surenCeza.cezaTuru === "UYARILDI1" && !uye.roles.cache.has(ayar.uyarı1)) {
      if (!uye.roles.cache.has(ayar.uyarı1)) uye.roles.add(ayar.uyarı1).catch(console.error);
    };
    if (surenCeza.cezaTuru === "UYARILDI2" && !uye.roles.cache.has(ayar.uyarı2)) {
      if (!uye.roles.cache.has(ayar.uyarı2)) uye.roles.add(ayar.uyarı2).catch(console.error);
    };
    if (surenCeza.cezaTuru === "VKCEZALI" && !uye.roles.cache.has(ayar.vkcezalırolu)) {
      if (!uye.roles.cache.has(ayar.vkcezalırolu)) uye.roles.add(ayar.vkcezalırolu).catch(console.error);
    };
    if (surenCeza.cezaTuru === "DC-CEZALI" && !uye.roles.cache.has(ayar.dccezalırolu)) {
      if (!uye.roles.cache.has(ayar.dccezalırolu)) uye.roles.add(ayar.dccezalırolu).catch(console.error);
    };
    if (surenCeza.cezaTuru === "REKLAM" && !uye.roles.cache.has(ayar.reklamRolu)) {
      if (!uye.roles.cache.has(ayar.reklamRolu)) uye.roles.set([ayar.reklamRolu]).catch(console.error);
    };
    if (surenCeza.cezaTuru === "VOICE-MUTE" && uye.voice.channelID && !uye.voice.serverMute) {
      if (uye.voice.channelID && !uye.voice.serverMute) uye.voice.setMute(true).catch(console.error);
    };
  };
  for (let i = 0; i < bitmisCezalar.length; i++) {
    let bitmisCeza = bitmisCezalar[i];
    if (!bitmisCeza) return;
    let uye = guild.members.cache.get(bitmisCeza.uyeID);
    let surenJail = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && (c.cezaTuru === "JAIL" || c.cezaTuru === "TEMP-JAIL")).length;
    if ((bitmisCeza.cezaTuru === "JAIL" || bitmisCeza.cezaTuru === "TEMP-JAIL") && uye.roles.cache.has(ayar.jailRolu) && !surenJail) {
      if (uye.roles.cache.has(ayar.jailRolu)) uye.roles.set(uye.roles.cache.has(ayar.boosterRolu) ? ayar.teyitsizRolleri.concat(ayar.boosterRolu) : ayar.teyitsizRolleri).catch(console.error);
    };
    let surenChatMute = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "CHAT-MUTE").length;
    if (bitmisCeza.cezaTuru === "CHAT-MUTE" && uye.roles.cache.has(ayar.muteRolu) && !surenChatMute) {
      if (uye.roles.cache.has(ayar.muteRolu)) uye.roles.remove(ayar.muteRolu).catch(console.error);
    };
   
    let uyarı1 = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "UYARILDI1").length;
    if (bitmisCeza.cezaTuru === "UYARILDI1" && uye.roles.cache.has(ayar.muteRolu) && !uyarı1) {
      if (uye.roles.cache.has(ayar.uyarı1)) uye.roles.remove(ayar.uyarı1).catch(console.error);
    };
    let dccezalı = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "DC-CEZALI").length;
    if (bitmisCeza.cezaTuru === "DC-CEZALI" && uye.roles.cache.has(ayar.muteRolu) && !dccezalı) {
      if (uye.roles.cache.has(ayar.dccezalırolu)) uye.roles.remove(ayar.dccezalırolu).catch(console.error);
    };
    let vkcezalı = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "VKCEZALI").length;
    if (bitmisCeza.cezaTuru === "VKCEZALI" && uye.roles.cache.has(ayar.muteRolu) && !vkcezalı) {
      if (uye.roles.cache.has(ayar.vkcezalırolu)) uye.roles.remove(ayar.vkcezalırolu).catch(console.error);
    };
    let uyarı2 = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "UYARILDI2").length;
    if (bitmisCeza.cezaTuru === "UYARILDI2" && uye.roles.cache.has(ayar.muteRolu) && !uyarı2) {
      if (uye.roles.cache.has(ayar.uyarı2)) uye.roles.remove(ayar.uyarı2).catch(console.error);
    };
    let surenVoiceMute = surenCezalar.filter(c => c.uyeID === bitmisCeza.uyeID && c.cezaTuru === "VOICE-MUTE").length;
    if (bitmisCeza.cezaTuru === "VOICE-MUTE" && uye.voice.channelID && uye.voice.serverMute && !surenVoiceMute) {
        if (uye.voice.channelID && uye.voice.serverMute) uye.voice.setMute(false).catch(() => {
          return undefined;
      });  
    };
  };
};