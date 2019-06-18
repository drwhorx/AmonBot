exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    var member = message.member
    if (message.mentions.users.size > 0) {
        if (message.level < 2)
            return message.channel.send(client.alert("You need to have a Perm Level of at least **Moderator** to run this command!"))
        args.splice(0, 1);
        member = message.guild.members.get(message.mentions.users.array()[0].id)
    }
    member.setNickname(args.join(" "));
    return message.channel.send({ embed: bot.success("Nickname set!") });
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "USER",
    botPerms: ["MANAGE_NICKNAMES"]
};

exports.help = {
    name: 'nick',
    description: 'Sets your or another persons nickname',
    uses: {
        commands: ["nick *name*", "nick *member* *name*"],
        descriptions: ["Set your nickname to a given *name*", "Set a *member*'s nickname to a given *name*"]
    }
};