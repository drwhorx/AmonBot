exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    var server = message.guild;
    var serverEmbed = new Discord.RichEmbed()
        .setTitle(`Server stats for ${server.name}`)
        .setColor("#FF9900")
        .addField('Name', server.name)
        .addField('Created', server.createdAt, true)
        .addField('Owner', server.owner.displayName)
        .addField('Members', server.members.size, true)
        .addField('Channels', server.channels.size, true)
        .addField('Roles', server.roles.size, true)
        .addField('Server Icon', server.iconURL)
        .setThumbnail(server.iconURL)
        .setTimestamp()
    message.channel.send({
        embed: serverEmbed
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
    name: 'serverstats',
    description: 'Gives info about this server',
    uses: {
        commands: [],
        descriptions: []
    }
};
