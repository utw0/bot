const ayar = global.sunucuAyar;
const client = global.client;
module.exports = () => {
    client.user.setPresence({ activity: { name: ayar.durum }, status: "iddle" });
    if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
    let guild = client.guilds.cache.get(ayar.sunucuID);
  let enAltYetkiliRolu = guild.roles.cache.get(ayar.enAltYetkiliRolu);
  client.roleCommandRoles = guild.roles.cache.filter(r => r.position >= enAltYetkiliRolu.position && !r.managed).array();
  setInterval(() => {
  client.user.setPresence({ activity: { name: ayar.durum }, status: "iddle" });
  if (client.channels.cache
    .has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}, 1000* 60 * 60 * 1);
}
module.exports.configuration = {
  name: "ready"
}