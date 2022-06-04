const { MessageEmbed } = require('discord.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar) => {
    let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor('GREEN');
    if (!client.kullanabilir(message.author.id)) return global.send(message.channel, embed.setDescription('Bu komutu kullanabilmek için gerekli rollere sahip değilsin!')).then(x => x.delete({ timeout: 5000 }));
    if (!args[0] || isNaN(args[0])) return global.send(message.channel, embed.setDescription('Geçerli bir kişi ID\'si belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    if (banLimitleri.get(message.author.id) >= ayar.unban) return global.reply(message, `\`${this.configuration.name} komutu için limite ulaştın!\``);
    let kisi = await client.users.fetch(args[0]);
    if (kisi) {
        message.guild.members.unban(kisi.id).catch(() => global.send(message.channel, embed.setDescription('Belirtilen ID numarasına sahip bir ban bulunamadı!')).then(x => x.delete({ timeout: 5000 })));
        message.react("☑️").catch(() => {
            return undefined;
        });
        if (client.channels.cache.find(c => c.name === ayar.banLogKanali)) global.send(client.channels.cache.find(c => c.name === ayar.banLogKanali), new MessageEmbed().setColor('WHITE').setTitle('Ban Kaldırıldı!').setDescription(`**Kaldıran Yetkili:** ${message.author} (\`${message.author.id}\`)\n**Banı Kaldırılan Üye:** ${kisi.tag} (\`${kisi.id}\`)`));
    } else {
        global.send(message.channel, embed.setDescription('Geçerli bir kişi ID\'si belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
    }
    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
    }
        setTimeout(() => {
        banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
    }, 1000 * 60 * 3);
};

module.exports.configuration = {
    name: 'unban',
    aliases: ['yasak-kaldır'],
    usage: 'unban [id] [isterseniz sebep]',
    description: 'Belirtilen kişinin banını kaldırır.',
    permLevel: 0
};


