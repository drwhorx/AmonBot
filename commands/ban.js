exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    if (!message.mentions.users.array()[0]) return message.channel.send({embed: bot.alert("State your victim first.")});    
    var banee = message.mentions.users.array()[0];
    var banned = message.guild.members.get(banee.id);
    var reason = args.length == 1 ? "Not specified" : args.slice(1).join(" ");
    banned.ban(reason);
    var channel = bot.getSetting(message.guild, "modLogsChannel")
    if (channel == "none")
        channel = message.channel
    var ban = new Discord.RichEmbed()
        .setTitle("❗️ A user has been banned!")
        .addField("Banee:", banee, true)
        .addField("Banner:", message.author, true)
        .addField("Reason:", reason)
        .setTimestamp()
        .setColor("#FF0000")
    channel.send({embed: ban})
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "MOD",
    botPerms: ["BAN_MEMBERS"]
};

exports.help = {
    name: "ban",
    description: "Bans someone from the server",
    uses: {
        commands: ["ban *member*", "ban *member* *reason*"],
        descriptions: ["Ban a given *member*", "Ban a given *member* for a *reason*"]
    }
};
