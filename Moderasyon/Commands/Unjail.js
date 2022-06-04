const { MessageEmbed } = require("discord.js");
const Penalty = require('../Models/Penalty.js');
var banLimitleri = new Map();

module.exports.execute = async (client, message, args, ayar, emoji) => {
	let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor(client.randomColor());
	if (!client.kullanabilir(message.author.id) && !ayar.jailciRolleri.some(rol => message.member.roles.cache.has(rol))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
	let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
	if (!uye) return global.send(message.channel, embed.setDescription("Geçerli bir üye belirtmelisin!")).then(x => x.delete({ timeout: 5000 }));
	if (banLimitleri.get(message.author.id) >= ayar.unjail) return global.reply(message, `\`${this.configuration.name} komutu için limite ulaştın!\``);
	if (uye.roles.highest.position >= message.guild.roles.cache.get(ayar.enAltYetkiliRolu).position) return message.reply('Yetkililer birbirlerini kayıt edemezler.');
	Penalty.find({ sunucuID: message.guild.id, uyeID: uye.id }).sort({ atilmaTarihi: -1 }).exec(async (err, data) => {
		let cezalar = data.filter(d => (d.cezaTuru === "TEMP-JAIL" || d.cezaTuru === "REKLAM" || d.cezaTuru === "JAIL") && (!d.bitisTarihi || d.bitisTarihi > Date.now()))
		if (!cezalar.length) return message.reply("bu kullanıcı jail yememis aga")
		cezalar.forEach(d => {
			d.bitisTarihi = Date.now();
			d.save();
			if (!client.kullanabilir(message.author.id) && !message.member.roles.cache.has(global.sunucuAyar.sahipRolu)) {
				banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0))+1);
			}
						setTimeout(() => {
				banLimitleri.set(message.author.id, (Number(banLimitleri.get(message.author.id) || 0)) - 1);
			}, 1000 * 60 * 3);
		});
		let yetkili = await client.users.fetch(cezalar[0].yetkiliID)
		let roller = await cezalar[0].yetkiler
				await uye.roles.set(roller).catch();
		if (uye.voice.channelID) uye.voice.kick().catch();
		global.send(message.channel, embed.setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.jailRolu).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
		if (client.channels.cache.find(c => c.name === ayar.jailLogKanali)) global.send(client.channels.cache.find(c => c.name === ayar.jailLogKanali), new MessageEmbed().setColor("GREEN").setDescription(`${uye} üyesinin ${message.guild.roles.cache.get(ayar.jailRolu).toString()} rolü, ${message.author} tarafından alındı!`)).catch();
		if (cezalar[0].yetkiliID === message.author.id) return
		await yetkili.send(`${message.author} yetkilisi ${uye}'ye attığın jaili kaldırdı.`).catch(err => undefined);
	});
};
module.exports.configuration = {
	name: "unjail",
	aliases: ['uncezalı'],
	usage: "unjail [üye]",
	description: "Belirtilen üyeyi jailden çıkarır.",
	permLevel: 0
};