exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    var mutee = message.mentions.users.array()[0];
    var reason = args.length == 1 ? "Not specified" : args.slice(1).join(" ");
    var user = bot.users.get(mutee.id);
    var member = message.guild.members.get(mutee.id);
    var channels = message.guild.channels.array();
    for (i = 0; i < channels.length; i++) {
        if (channels[i].type == 'text') {
            channels[i].overwritePermissions(member, {
                SEND_MESSAGES: null,
                ADD_REACTIONS: null
            })
        }
    }
    var mute = new Discord.RichEmbed()
        .setTitle('A user has been unmuted.')
        .addField('Mutee', user, true)
        .addField('Muter', message.author, true)
        .addField('Reason:', reason)
        .setTimestamp()
        .setColor("#ff9900")
    message.channel.send({
        embed: mute
    })
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['unshush'],
    permLevel: "MOD",
    botPerms: ["MANAGE_ROLES"]
};

exports.help = {
    name: 'unmute',
    description: 'Unmute a user.',
    uses: {
        commands: ["unmute *member*"],
        descriptions: ["Unmute a given *member*"]
    }
};
