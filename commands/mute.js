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
                SEND_MESSAGES: false,
                ADD_REACTIONS: false
            })
        }
    }
    var mute = new Discord.RichEmbed()
        .setTitle('❗️ A user has been muted!')
        .addField('Mutee', user, true)
        .addField('Muter', message.author, true)
        .addField('Reason:', reason)
        .setTimestamp()
        .setColor("#ff0000")
    message.channel.send({
        embed: mute
    })
};
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ['shush'],
    permLevel: "MOD",
    botPerms: ["MANAGE_ROLES"]
};
exports.help = {
    name: 'mute',
    description: 'Mutes a member',
    uses: {
        commands: ["mute *member*", "mute *member* *reason*"],
        descriptions: ["Mute a given *member*", "Mute a given *member* for a *reason*"]
    }
};
