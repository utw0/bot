/* eslint-disable linebreak-style */
const { MessageEmbed } = require('discord.js');
const Database = require('../Models/Member.js');
const Member = require('../Models/Member.js');

module.exports.execute = async (client, message, args, conf, emoji) => {
	let embed = new MessageEmbed().setAuthor(message.member.displayName, message.author.avatarURL({ dynamic: true })).setColor("ff0013");
	let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
	if (!client.kullanabilir(message.author.id) && !conf.teyitciRolleri.some(r => message.member.roles.cache.has(r))) return message.react(`${client.emojis.cache.find(x => x.name === "Iptal")}`);
	if (!member) return global.send(message.channel, embed.setDescription('Geçerli bir üye belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
	if (member.roles.highest.position >= message.guild.roles.cache.get(conf.enAltYetkiliRolu).position) return global.send(message.channel, '`Yetkililer birbirlerini kayıt edemezler.`').then(x => x.delete({ timeout: 5000 }));
	//if (message.member.roles.highest.position <= member.roles.highest.position) return message.channel.send(embed.setDescription('Belirttiğin kişi senden üstün veya onunla aynı yetkidesin!')).then(x => x.delete({ timeout: 5000 }));

	args = args.filter(a => a !== '' && a !== ' ').splice(1);
	let name = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', 'İ').toUpperCase() + arg.slice(1)).join(' ');
	let displayName;
	let age = args.filter(arg => !isNaN(arg))[0] || undefined;
	if (!name || !age) return global.send(message.channel, embed.setDescription('Geçerli bir isim ve yaş belirtmelisin!')).then(x => x.delete({ timeout: 5000 }));
	displayName = `${member.user.username.includes(conf.tag) ? conf.tag : conf.ikinciTag} ${name} | ${age}`;

	let memberData = await Database.findOne({ userID: member.id }) || {};
	let historyData = memberData.history || [];

	let msg = await message.channel.send(
		embed.setDescription(historyData.length > 0 ? [
			`Bu Kullanıcının Sunucudaki Eski İsimleri [**${historyData.length}**]`,
			`${historyData.map((x) => `\`▫️ ${x.name}\` (<@&${x.role}>)`).join('\n')}\n`,
		] : `${member.toString()} kişisinin ismi "${displayName.slice(2)}" olarak değiştirildi.`));

	await message.react(`${client.emojis.cache.find(x => x.name === "e_")}`);
	await message.react(`${client.emojis.cache.find(x => x.name === "k_")}`);
	

	const filter = (reaction, user) => {
		return ["e_", "k_"].includes(reaction.emoji.name) && user.id === message.author.id;
	};
	const collector = message.createReactionCollector(filter, { max: 1, time: 30000, error: ['time'] });
	let nickRole, roles;
	collector.on('collect', async (reaction) => {
		if (reaction.emoji.name == "e_") {
			if (conf.kizRolleri.some(x => member.roles.cache.has(x))) await member.roles.remove(conf.kizRolleri).catch(() => { return undefined; })
			if (member.roles.cache.has(conf.boosterRolu)) roles = conf.erkekRolleri.concat(conf.boosterRolu);
			else roles = conf.erkekRolleri;
			member.setNickname(displayName);
			await member.roles.set(roles).catch(() => { return undefined; });
			if (member.user.username.includes(conf.tag)) {
				await member.roles.add(conf.ekipRolu).catch()
			}
			message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);
			msg.delete();
			global.send(message.guild.channels.cache.find(x => x.name === conf.chatKanali), `${member.toString()} \`Aramıza hoş geldiniz! Rol seçim odalarından rolleriniz almayı unutmayın iyi eğlenceler.\` `).then(x => x.delete({ timeout: 30000 }));
			if (conf.teyitsizRolleri.some(r => member.roles.cache.has(r))) staffInit(message.author.id, message.guild.id, 'erkekTeyit');
			nickRole = { name: displayName, role: conf.erkekRolleri[0] };
			historyData.push(nickRole);
			nameInit(message.author, member, historyData, message.guild.id);
			let yetkiliBilgi = new Map();
			yetkiliBilgi.set("erkekTeyit", 1);
			let authorData = await Member.findOne({ guildID: message.guild.id, userID: message.author.id });
			if (!authorData) {
				let newMember = new Member({
					guildID: message.guild.id,
					userID: message.author.id,
					staffID: null,
					afk: {},
					yetkili: yetkiliBilgi
				});
				newMember.save();
			} else {
				let oncekiTeyit = authorData.yetkili.get("erkekTeyit") || 0;
				authorData.yetkili.set("erkekTeyit", Number(oncekiTeyit) + 1);
				authorData.save();
			};
		} else if (reaction.emoji.name == "k_") {
			if (conf.erkekRolleri.some(x => member.roles.cache.has(x))) await member.roles.remove(conf.erkekRolleri).catch(() => { return undefined; });
			if (member.roles.cache.has(conf.boosterRolu)) roles = conf.kizRolleri.concat(conf.boosterRolu);
			else roles = conf.kizRolleri;
			member.setNickname(displayName);
			await member.roles.set(roles).catch(() => { return undefined; });
			if (member.user.username.includes(conf.tag)) {
				await member.roles.add(conf.ekipRolu).catch()
			}
			message.react(`${client.emojis.cache.find(x => x.name === "Onay")}`);
			msg.delete();
			global.send(message.guild.channels.cache.find(x => x.name === conf.chatKanali), `${member.toString()} \`Aramıza hoş geldiniz! Rol seçim odalarından rolleriniz almayı unutmayın iyi eğlenceler.\` `).then(x => x.delete({ timeout: 30000 }));
			if (conf.teyitsizRolleri.some(r => member.roles.cache.has(r))) staffInit(message.author.id, message.guild.id, 'kizTeyit');
			nickRole = { name: displayName, role: conf.kizRolleri[0] };
			historyData.push(nickRole);
			nameInit(message.author, member, historyData, message.guild.id);
			let yetkiliBilgi = new Map();
			yetkiliBilgi.set("kizTeyit", 1);
			let authorData = await Member.findOne({ guildID: message.guild.id, userID: message.author.id });
			if (!authorData) {
				let newMember = new Member({
					guildID: message.guild.id,
					userID: message.author.id,
					staffID: null,
					afk: {},
					yetkili: yetkiliBilgi
				});
				newMember.save();
			} else {
				let oncekiTeyit = authorData.yetkili.get("kizTeyit") || 0;
				authorData.yetkili.set("kizTeyit", Number(oncekiTeyit) + 1);
				authorData.save();
			};

		}

	});

	collector.on('end', async () => {
		if (member.user.username.includes(conf.tag)) {
			await member.roles.add(conf.ekipRolu).catch(() => { return undefined; });
		}
		message.reactions.removeAll();
	});
	collector.on('error', () => msg.delete({ timeout: 30000 }));
};

module.exports.configuration = {
	name: 'kayıt',
	aliases: ['name', 'nick', 'e', 'k'],
	usage: 'kayıt [üye] [isim] [yaş]',
	description: 'Belirtilen üyeyi sunucuya kaydeder veya sadece ismini değiştirir.',
	permLevel: 0
};

async function nameInit(staff, member, historyData, guild) {
	if (await Database.findOne({ userID: member.id })) return await Database.updateOne({ userID: member.id }, { history: historyData }).exec();
	else {
		const newMemberData = new Database({
			guildID: guild,
			userID: member.user.id,
			staffID: staff.id,
			afk: {},
			history: historyData,
			yetkili: new Map()
		});
		return newMemberData.save();
	}
}

async function staffInit(authorID, guild, teyit) {
	let yetkiliBilgi = new Map();
	yetkiliBilgi.set(teyit, 1);
	let authorData = await Database.findOne({ guildID: guild, userID: authorID });
	if (!authorData) {
		let newMember = new Database({
			guildID: guild,
			userID: authorID,
			staffID: null,
			afk: {},
			history: [],
			yetkili: yetkiliBilgi
		});
		newMember.save();
	} else {
		let oncekiTeyit = authorData.yetkili.get(teyit) || 0;
		authorData.yetkili.set(teyit, Number(oncekiTeyit) + 1);
		authorData.save();
	}
}
