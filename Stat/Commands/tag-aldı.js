const { MessageEmbed } = require('discord.js');
const tagAldirma = require("../Models/tagAldirma.js");

module.exports.execute = async (client, message, args, ayar, emoji) => {

    if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(ayar.ekipRolu)) return message.react(emoji.iptal);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({ timeout: 7500 }))

    if (args[0] === "liste") {
        let tagAldirilanListe = await tagAldirma.find({ sunucuID: message.guild.id, tagAldiranUye: message.author.id }) || [];
        let sayfaNo = isNaN(args[1]) ? 0 : Number(args[1]);
        let sunucudakiUyeler = tagAldirilanListe.filter(x => message.guild.members.cache.has(x.tagAlanUye));
        if (sayfaNo > Math.floor(sunucudakiUyeler.length / sayfaNo)) return message.reply(`Geçerli bir sayfa numarası belirt! (0-${Math.floor(sunucudakiUyeler.length / sayfaNo)})`).then(x => x.delete({ timeout: 15000 }));
        message.channel.send(new MessageEmbed().setDescription(`${message.author} üyesinin tag aldırdığı üyeler; **(${tagAldirilanListe.length})**\n\n**Sunucuda bulunanlar;**\n${sunucudakiUyeler.slice((sayfaNo * 10), ((sayfaNo * 10) + 10)).map((data, index) => `\`${index + 1}.\` ${message.guild.members.cache.get(data.tagAlanUye).toString()} | ${data.tagAlanUye} (${new Date(data.tarih).toTurkishFormatDate()})`).join("\n")}\n\n**Sayfa No:** ${sayfaNo}/${Math.floor(sunucudakiUyeler.length / sayfaNo)}`).setAuthor(message.guild.name + " Tag Aldırma Sistemi", message.guild.iconURL({ dynamic: true })).setTimestamp().setFooter("LuhuX Was Here"));
        return;
    };

    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!uye || !uye.user.username.includes(ayar.tag)) return message.reply("Geçerli bir **taglı üye** belirtmelisin!\nliste yazarak tag aldırdığın üyelerin listesini görebilirsin.").then(x => x.delete({ timeout: 15000 }));
    let uyeTagAlmaData = await tagAldirma.findOne({ sunucuID: message.guild.id, tagAlanUye: uye.id });
    if (uyeTagAlmaData) return message.reply("Belirtilen üyeye daha önceden bir başkası tarafından tag aldırılmış!");
    const reactionFilter = async (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id == uye.id;
    };
    let onayEmbed = new MessageEmbed().setDescription(`**DİKKATLİ OKUMALISIN!**\nMerhaba ${uye}, **${message.guild.name}** adlı sunucudan bir üye, size sunucu tagını aldırdığını iddia ediyor.\n\n**Üye:** ${message.author} | ${message.author.tag} | ${message.author.id}\n\nEğer yukarıda belirtilen üye, **size sunucu tagını aldırdıysa** lütfen işlemi mesajdaki **tike basarak onaylayın!** (Aldırmadıysa görmezden gelin)`).setAuthor(message.guild.name + " Tag Aldırma Sistemi", message.guild.iconURL({ dynamic: true })).setTimestamp().setFooter("LuhuX Was Here");
    let msj = await uye.send(`${uye}`, { embed: onayEmbed }).catch(err => { return message.channel.send(`${uye}`, { embed: onayEmbed }) });
    await msj.react("✅");
    msj.awaitReactions(reactionFilter, { max: 1, time: 60000, error: ["time"] }).then(async c => {
        let cevap = c.first();
        if (cevap) {
            let yeniTagAldirma = new tagAldirma({
                sunucuID: message.guild.id,
                tagAlanUye: uye.id,
                tagAldiranUye: message.author.id,
                tarih: Date.now()
            });
            await yeniTagAldirma.save();
            message.reply("Belirtilen üye, ona tag aldırdığınızı **doğruladı ve işlem kaydedildi!**").then(x => x.delete({ timeout: 15000 }));
            global.send(message.guild.channels.cache.find(c => c.name === ayar.ekipLogKanali), `${message.author} Bir üyeye  tagımızı aldırdı, tagımızı aldırdığı üye ${uye}, ailemizi büyüttüğün için teşekkür ederim.\n\`────────────────────────\``).catch(console.error);
            msj.delete();

        };
    }).catch(err => {
        msj.delete();

        message.reply("Belirtilen üye, ona tag aldırdığınızı **doğrulamadı!**").then(x => x.delete({ timeout: 15000 }));
    });
};
module.exports.configuration = {
    name: 'tag-aldı',
    aliases: ["tag-aldi","taglı"],
    usage: 'tag-aldı [üye]/liste',
    description: 'Belirtilen taglı üyeye, tagı komutu kullanan kişinin aldırdığına dair onay mesajı gönderir.',
    permLevel: 0
};