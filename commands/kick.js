exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    if (!message.mentions.users.array()[0]) return message.channel.send({embed: bot.alert("State your victim first.")});    var kickee = message.mentions.users.array()[0];
    var kickee = message.mentions.users.array()[0];
    var kicked = message.guild.members.get(banee.id);
    var reason = args.length == 1 ? "Not specified" : args.slice(1).join(" ");
    kicked.kick(reason);
    var channel = bot.getSetting(message.guild, "modLogsChannel")
    if (channel == "none")
        channel = message.channel
    var kick = new Discord.RichEmbed()
        .setTitle('❗️ A user has been kicked!')
        .addField('Kickee', kickee, true)
        .addField('Kicker', message.author, true)
        .addField('Reason:', reason)
        .setTimestamp()
        .setColor('#ff0000')
    channel.send({embed: kick})
};

exports.conf = {
	enabled: true,
	guildOnly: false,
	aliases: [],
    permLevel: "MOD",
    botPerms: ["KICK_MEMBERS"]
};

exports.help = {
	name: 'kick',
	description: 'Kicks a specified user',
	uses: {
        commands: ["kick *member*", "kick *member* *reason*"],
        descriptions: ["Kick a given *member*", "Kick a given *member* for a *reason*"]
    }
};