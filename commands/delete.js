exports.run = (bot, message, args, level) => {
    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send({ embed: new Discord.RichEmbed().setTitle("❌ I do not have permission.").setColor("#ff0000") });
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send({ embed: new Discord.RichEmbed().setTitle("❌ You do not have permission.").setColor("#ff0000") });
    var num = parseInt(args[0]);
    const Discord = require("discord.js");
    num += 1;
    if (!isNaN(num)) {
        message.channel.bulkDelete(num);
        message.channel.send({ embed: bot.success(args[0] + " messages deleted by **" + message.author.username + "**") })
            .then(msg => setTimeout(function () { msg.delete() }, 5000));
    } else {
        message.channel.send({ embed: bot.alert("Invalid number of messages!") });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['purge', 'clear'],
    permLevel: "MOD",
    botPerms: ["MANAGE_MESSAGES"]
};

exports.help = {
    name: 'delete',
    description: 'Clear multiple messages',
    uses: {
        commands: ["delete *number*"],
        descriptions: ["Delete a *number* of messages"]
    }
};