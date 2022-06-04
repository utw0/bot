const { MessageEmbed } = require('discord.js');

module.exports.execute = async (client, message, args, ayar) => {

    if (!message.member.voice.channelID) return global.reply('lütfen bir ses kanalına giriş yap');
    message.member.voice.channel.members.forEach((member) => member.voice.setMute(false));
    message.react("☑️")

};
module.exports.configuration = {
    name: 'allunmute',
    aliases: [],
    usage: 'allunmute',
    description: '',
    permLevel: 2
};