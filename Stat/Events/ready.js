const ayar = global.sunucuAyar;
const client = global.client;
const MemberStats = require('../Models/MemberStats.js');

module.exports = async ()  => {
    client.user.setPresence({ activity: { name: ayar.durum }, status: "iddle" });
    if (client.channels.cache.has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
  setInterval(() => {
  client.user.setPresence({ activity: { name: ayar.durum }, status: "iddle" });
  if (client.channels.cache
    .has(ayar.botSesKanali)) client.channels.cache.get(ayar.botSesKanali).join().catch();
}, 1000* 60 * 60 * 1);

}
module.exports.configuration = {
  name: "ready"
}