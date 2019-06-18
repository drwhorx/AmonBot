exports.run = (bot, message, args) => {
    const Discord = require('discord.js');
    uptime = bot.uptime;
    time = Math.floor(uptime / 1000);
    if (time >= 3600) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = time % 60 % 60;
        var timecode = `${hours} hours, ${minutes} minutes, and ${seconds} seconds.`
    } else if (time >= 60) {
        var minutes = Math.floor(time / 60);
        var seconds = time % 60;
        var timecode = `${minutes} minutes and ${seconds} seconds`;
    } else {
        var timecode = `${time} seconds`;
    }
    stats = new Discord.RichEmbed()
        .setTitle("AmonBot Stats")
        .setColor("#FF9900")
        .addField('Users', bot.users.size, true)
        .addField('Owner', 'drwhorx#5533')
        .addField('Channels', bot.channels.size, true)
        .addField('Servers', bot.guilds.size, true)
        .addField('Uptime', timecode, true)
        .setThumbnail(bot.user.avatarURL)
    message.channel.send({
        embed: stats
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: "stats",
    description: "Gives some useful bot statistics",
    uses: {
        commands: [],
        descriptions: []
    }
};
