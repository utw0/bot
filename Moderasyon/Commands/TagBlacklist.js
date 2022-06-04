const path = "../../yasaklitag.json";
const file = require(path);
const fs = require("fs")
const { MessageEmbed } = require("discord.js");

module.exports.execute = async (client, message, args, ayar) => {
    if(!args[0]) {
        return message.channel.send(
            new MessageEmbed()
            .setDescription(`${file.taglar.length < 1 ? "Yasaklı tag bulunamadı." : `Yasaklı taglar: ${file.taglar.map(x => `\`` + x + `\``).join(", ")}`}`)
            .setFooter("Yasaklı tag eklemek/kaldırmak için: !yasaklı-tag ekle/kaldır <tag>")
        )
    } else if(args[0] === "ekle") {
        if(!args[1]) return message.reply("bir tag girmelisin.");
        const tag = args[1];
        if(global.yasaklitag.taglar.some(x => x === tag)) return message.reply("bu tag zaten eklenmiş.");
        file.taglar.push(tag);
        fs.writeFile("./yasaklitag.json", JSON.stringify(file), (err) => {
            if (err) {
                file.taglar = file.taglar.filter(x => x !== tag);
                return console.log(err);
            }
            global.yasaklitag.taglar = file.taglar;
            return message.channel.send(
                new MessageEmbed()
                .setDescription(`**${tag}** başarıyla yasaklı tag listesine eklendi.`)
            );
        });
    } else if(args[0] === "kaldır") {
        if(!args[1]) return message.reply("bir tag girmelisin.");
        const tag = args[1];
        if(!global.yasaklitag.taglar.some(x => x === tag)) return message.reply("bu tag zaten eklenmemiş.");
        file.taglar = file.taglar.filter(x => x !== tag);
        fs.writeFile("./yasaklitag.json", JSON.stringify(file), (err) => {
            if (err) {
                file.taglar = file.taglar.push(tag);
                return console.log(err);
            }
            global.yasaklitag.taglar = file.taglar;
            return message.channel.send(
                new MessageEmbed()
                .setDescription(`**${tag}** başarıyla yasaklı tag listesinden çıkarıldı.`)
            );
        });
    } else {
        return message.channel.send(
            new MessageEmbed()
            .setDescription(`${file.taglar.length < 1 ? "Yasaklı tag bulunamadı." : `Yasaklı taglar: ${file.taglar.map(x => `\`` + x + `\``).join(", ")}`}`)
            .setFooter("Yasaklı tag eklemek/kaldırmak için: !yasaklı-tag ekle/kaldır <tag>")
        )
    }
};
module.exports.configuration = {
    name: 'yasaklı-tag',
    aliases: ["yasaklıtag"],
    usage: 'yasaklı-tag',
    description: 'Yasaklı tag komutu.',
    permLevel: 1
};