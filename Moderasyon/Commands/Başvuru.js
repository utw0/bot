const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && !["başvuru-log","yetkili-başvuru","başvuru"].includes(message.channel.name) && !ayar.commandkanali.includes(message.channel.name)) return message.reply("yetkili-başvuru","başvuru-log").then(x => x.delete({timeout: 7500}))
      if (!message.author.username.includes(ayar.tag)) return message.reply("Yetkili başvurusu yapabilmek için öncelikle sunucu tagını ismine almalısın!\n"+ayar.tag).then(x => x.delete({timeout: 15000}));
    if (message.member.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    let sorular = [
        "Neden yetkili olmak istiyorsun?",
        "Yetkililik tecrüben var mı?",
        "Haftada kaç saat aktif olabilrisin."
    ];
    let cevaplar = args.join(" ").split(" - ");
    if (!args[0] || cevaplar.length != sorular.length) return message.reply(`Soruları doğru doldurmalısın! (Aralarına - koymalısın! Örn: \`Styx 19 - LuhuX ile ilgileniyorum.\`)\nSorular: ${sorular.join("\n")}`).then(x => x.delete({timeout: 15000}));
    let basvuruEmbed = new MessageEmbed().setColor("GREEN").setFooter("Başvuruya bakıldıktan sonra lütfen mesajın altına tik bırakınız.").setTimestamp().setAuthor(`${message.author.tag} (\`${message.author.id}\`)`, message.author.avatarURL({dynamic: true})).setDescription(`${message.author} üyesinin yetkili başvurusu;`);
    for (let i = 0; i < sorular.length; i++) {
        basvuruEmbed.addField(sorular[i], cevaplar[i]);
    };
    message.react("☑️")
    global.send(message.guild.channels.cache.find(x => x.name === ayar.basvuruLogKanali),`<@&${ayar.yetkilialım}>`,basvuruEmbed);

};
module.exports.configuration = {
    name: 'başvuru',
    aliases: ["basvuru"],
    usage: 'başvuru',
    description: '',
    permLevel: 0
};