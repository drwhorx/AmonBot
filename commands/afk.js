exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    const fs = require('fs');
    var obj = {
        "id": message.author.id,
        "reason": !args[0] ? "not specified" : args.join(" "),
    }
    var afkJson = fs.readFileSync('./afk.json');
    var afk = JSON.parse(afkJson);
    var found = afk.findIndex(function (e) {
        return e.id == message.author.id
    })
    if (found != -1) {
        afk[found] = obj
        fs.writeFileSync('./afk.json', JSON.stringify(afk));
        message.channel.send({
            embed: new Discord.RichEmbed()
                .setTitle("AFK reason updated:")
                .addField('Reason:', obj.reason)
                .setTimestamp()
                .setColor('#FF9900')
        });
    } else {
        afk.push(obj)
        fs.writeFileSync('./afk.json', JSON.stringify(afk));
        message.channel.send({
            embed: new Discord.RichEmbed()
                .setTitle(message.author.username + ' is AFK')
                .addField('Reason:', obj.reason)
                .setTimestamp()
                .setColor('#FF9900')
        });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'afk',
    description: 'Sets your afk status',
    uses: {
        commands: ["afk", "afk *reason*"],
        descriptions: ["Go AFK with no reason", "Go AFK with a given *reason*"]
    }
};