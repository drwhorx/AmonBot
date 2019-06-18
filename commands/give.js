exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    if (!message.mentions.users.array()[0]) return message.channel.send({embed: bot.alert("Please mention a user!")});
    var user = message.mentions.users.array()[0];
    var roleToGive = args.slice(1).join(' ');
    let role = message.guild.roles.find("name", roleToGive);
    if (!role) {
        message.channel.send({embed: bot.alert("That role does not exist!")});
    } else if (role.comparePositionTo(message.member.highestRole) < 0) {
        message.guild.members.get(user.id).addRole(role).then(m => {
            if(m.roles.has(role.id))
                message.channel.send({embed: bot.alert(`**${user.username}** now has the **${roleToGive}** role.`)});
            else
                message.channel.send({embed: bot.alert(`Unable to give **${user.username}** the **${roleToGive}** role! This is most likely a permissions issue; contact an admin.`)});
        }).catch(console.error);
    } else
        message.channel.send({embed: bot.alert("This role is too advanced for you!")});
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "MOD",
    botPerms: ["MANAGE_ROLES"]
};

exports.help = {
    name: 'give',
    description: 'Give someone else or yourself a role',
    uses: {
        commands: ["give *@user* *role*"],
        descriptions: ["Give an *@user* a *role*"]
    }
};
