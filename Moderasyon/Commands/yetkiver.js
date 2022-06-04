const fs = require("fs");

const path = "./Moderasyon/yetkiler.json";
const perms = require("../yetkiler.json");

const { MessageEmbed, WebhookClient } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {
    if (!client.kullanabilir(message.author.id) && message.member.hasPermission("VIEW_AUDIT_LOG") && !ayar.muteciRolleri.some(rol => message.member.roles.cache.has(rol))  && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
    if (!client.kullanabilir(message.author.id) && !ayar.commandkanali.includes(message.channel.name)) return message.reply(ayar.commandkanali.map(x => `${x}`).join(",")).then(x => x.delete({timeout: 7500}))
    const Webhook = new WebhookClient(ayar.yetkiwebhookid, ayar.yetkiwebhooktoken);
    if (!args[0]) return message.reply("\`oluştur\`,\`liste\`,\`bilgi\` \`düzenle\` veya \`kaldır\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
    if (args[0] === "oluştur") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.reply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }))
        if (!args[1]) return message.reply("bir isim girmelisin.");
        if (perms[args[1]]) return message.reply("bu isimde zaten bir yetki mevcut.");
        perms[args[1]] = { roles: [], authors: [] }
        fs.writeFile(path, JSON.stringify(perms), (err) => {
            if (err) return console.log(err);
            return message.channel.send(
                new MessageEmbed()
                    .setDescription(`**${args[1]}** yetkisi başarıyla oluşturuldu.`)
            ).then(x => x.delete({ timeout: 7500 }))
        });
    } else if (args[0] === "kaldır") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.reply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }))
        if (!args[1]) return message.reply("bir yetki ismi girmelisin.");
        if (!perms[args[1]]) return message.reply("yetki bulunamadı.");
        delete perms[args[1]];
        fs.writeFile(path, JSON.stringify(perms), (err) => {
            if (err) return console.log(err);
            return message.channel.send(
                new MessageEmbed()
                    .setDescription(`**${args[1]}** yetkisi başarıyla kaldırıldı.`)
            ).then(x => x.delete({ timeout: 7500 }));
        });
        Webhook.send(
            new MessageEmbed()
                .setDescription(`Ayarlayan : ${message.author}\n**${args[1]}** yetkisi başarıyla kaldırıldı.`)
        ).then(x => x.delete({ timeout: 7500 }));
    } else if (args[0] === "düzenle") {
        if (!ayar.yetkiayar.includes(message.author.id)) return message.reply("`Yetki ayarlamaya idin girilmemiş.`").then(x => x.delete({ timeout: 7500 }));
        if (!args[1]) return message.reply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }))
        if (!perms[args[1]]) return message.reply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }))
        if (!args[2] && args[2] !== "roller" && args[2] !== "kullanabilecekler") return message.reply("\`roller\` veya \`kullanabilecekler\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
        if (args[2] === "roller") {
            const roles = message.mentions.roles.array();
            if (roles.length < 1) return message.reply("rol veya roller etiketlemelisin.").then(x => x.delete({ timeout: 7500 }));
            perms[args[1]].roles = roles.map(role => role.id);
            fs.writeFile(path, JSON.stringify(perms), (err) => {
                if (err) return console.log(err);
                return message.channel.send(
                    new MessageEmbed()
                        .setDescription(`**${args[1]}** yetkisinde verilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                ).then(x => x.delete({ timeout: 7500 }));
            });
            Webhook.send(
                    new MessageEmbed()
                        .setDescription(`Ayarlayan: ${message.author}\n**${args[1]}** yetkisinde verilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                ).then(x => x.delete({ timeout: 7500 }));
        } else if (args[2] === "kullanabilecekler") {
            const roles = message.mentions.roles.array();
            if (roles.length < 1) return message.reply("rol veya roller etiketlemelisin.").then(x => x.delete({ timeout: 7500 }))
            perms[args[1]].authors = roles.map(role => role.id);
            fs.writeFile(path, JSON.stringify(perms), (err) => {
                if (err) return console.log(err);
                return message.channel.send(
                    new MessageEmbed()
                        .setDescription(`**${args[1]}** yetkisini verebilecek roller ${roles.join(", ")} olarak ayarlandı.`)
                ).then(x => x.delete({ timeout: 7500 }));
            });
            Webhook.send(
                new MessageEmbed()
                    .setDescription(`Ayarlayan: ${message.author}\n**${args[1]}** yetkisini verebilecek roller ${roles.join(", ")} olarak ayarlandı.`)).then(x => x.delete({ timeout: 7500 }));

        }
    } else if (args[0] === "ver") {
        if (!args[1]) return message.reply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.reply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.reply("bu yetkiyi vermek için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!targetMember) return message.reply("bir kullanıcı girmelisin.");
        Webhook.send( new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
        .setColor("GREEN").setTitle("Rol Verildi").setTimestamp()
        .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Verilen Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}`))
        
        global.send(message.guild.channels.cache.find(c => c.name === ayar.basvuruLogKanali),  new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setColor("GREEN").setTitle("Rol Verildi").setTimestamp()
            .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Verilen Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}`))
        await targetMember.roles.add(targetPerm.roles).catch(err => {
            return message.channel.send(`❌ Rol vermede bir hata oluştu: **${err.message}**`).then(x => x.delete({ timeout: 7500 }));
        });
        await message.react("✅");
    } else if (args[0] === "al") {
        if (!args[1]) return message.reply("bir yetki ismi girmelisin.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.reply("yetki bulunamadı.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.reply("bu yetkiyi almak için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        const targetMember = message.mentions.members.first() || message.guild.members.cache.get(args[2]);
        if (!targetMember) return message.reply("bir kullanıcı girmelisin.").then(x => x.delete({ timeout: 7500 }));
        Webhook.send(new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("RED").setTitle("Rol Alındı").setTimestamp().setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Alınan Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}}`))
      
        global.send(message.guild.channels.cache.find(c => c.name === ayar.basvuruLogKanali), new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true }))
            .setColor("RED").setTitle("Rol Alındı").setTimestamp()
            .setDescription(`**İşlemi Yapan Üye:** ${message.author} \`${message.author.id}\`)\n\n**İşlem Yapılan Üye:**${targetMember} (\`${targetMember.id}\`)\n\n**Alınan Roller:** ${args[1]} - ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}}`))

        await targetMember.roles.remove(targetPerm.roles).catch(err => {
            return message.channel.send(`❌ Rol almada bir hata oluştu: **${err.message}**`).then(x => x.delete({ timeout: 7500 }));
        });
        await message.react("✅");
    } else if (args[0] === "liste") {
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.reply("bu yetkiyi vermek için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        global.send(message.channel, new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setDescription(
            `Oluşturulan Yetkiler: ${Object.keys(perms).join(', ')}`))
    } else if (args[0] === "bilgi") {
        if (!message.member.hasPermission("ADMINISTRATOR") && !targetPerm.authors.some(id => message.member.roles.cache.has(id))) return message.reply("bu yetkiyi vermek için yetkin yok.").then(x => x.delete({ timeout: 7500 }));
        if (!perms[args[1]]) if (!args[1]) return message.reply("Oluşturulmuş bir yetki ismi belirtmelisin. \`.yetki liste\` Yazarak oluşturulan yetkileri görebilirsin.").then(x => x.delete({ timeout: 7500 }));
        const targetPerm = perms[args[1]];
        global.send(message.channel, new MessageEmbed().setColor(client.randomColor()).setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setDescription(
               `**Yetki İsmi:** ${[args[1]]}
                 **Verilen Rollerin Idsi:** ${targetPerm.roles.map(x => `<@&${x}>`).join(",")}
                 **Verebilen Rollerin Idsi:** ${targetPerm.authors.map(x => `<@&${x}>`).join(",")}`

        ))


    } else {
        return message.reply("\`oluştur\`,\`liste\`,\`bilgi\` \`düzenle\` veya \`kaldır\` argümanlarını kullanmalısın.").then(x => x.delete({ timeout: 7500 }))
    }

};

module.exports.configuration = {
    name: 'yetki',
    aliases: ["r"],
    usage: 'yetki',
    description: 'yönetim',
    permLevel: 0
};
