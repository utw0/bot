const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {

    if (!message.member.voice.channelID) return global.reply('lütfen bir ses kanalına giriş yap');
    message.member.voice.channel.members.filter((member) => member.id !== message.author.id).forEach((member) => member.voice.setMute(true));
    message.react("☑️")

};
module.exports.configuration = {
    name: 'allmute',
    aliases: [],
    usage: 'allmute',
    description: '',
    permLevel: 2
};