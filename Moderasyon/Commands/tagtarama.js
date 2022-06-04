const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {

    message.react("☑️")
    message.guild.members.cache.filter(x => !x.user.username.includes(ayar.tag) && !ayar.vipRole.some(r => x.roles.cache.has(r)) && !ayar.teyitsizRolleri.some(r => x.roles.cache.has(r)) && !x.roles.cache.has(ayar.fakeHesapRolu) && !x.roles.cache.has(ayar.jailRolu) && x.roles.cache.has(ayar.ekipRolu) && !x.roles.cache.has(ayar.yasakTagRolu)).array().forEach(async (x, index) => {
        if (x.hasPermission("MANAGE_CHANNELS") && x.hasPermission("ADMINISTRATOR")) return
        if (x.user.discriminator.includes("1977")) return
        if (x.user.username.includes("shy")) return
        if (x.user.username.includes("Shy")) return
        if (x.user.username.includes("^")) return
        if (x.user.bot) return
        await x.setNickname(x.displayName.replace(ayar.tag, ayar.ikinciTag));
        x.roles.set(ayar.teyitsizRolleri);
    });

};
module.exports.configuration = {
    name: 'tarama',
    aliases: [],
    usage: 'tarama tagsizlari kayitsiza atar',
    description: '',
    permLevel: 1
};