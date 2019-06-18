exports.run = (bot, message, args, level) => {
    var xkcd = require('xkcd');
    const Discord = require('discord.js')
    if (args[0] == "random") {
        xkcd(function (data) {
            var rand = Math.floor(Math.random() * data.num);
            xkcd(rand, function (moredata) {
                var output = new Discord.RichEmbed();
                output.setTitle(`"` + moredata.title + `"`);
                output.setImage(moredata.img);
                output.setColor("#ff9900");
                message.channel.send({
                    embed: output
                });
            });
        });
    } else if (!args[0]) {
        xkcd(function (data) {
            var output = new Discord.RichEmbed();
            output.setTitle(`"` + data.title + `"`);
            output.setImage(data.img);
            output.setColor("#ff9900");
            message.channel.send({
                embed: output
            });
        });
    } else {
        xkcd(args[0], function (data) {
            var output = new Discord.RichEmbed();
            output.setTitle(`"` + data.title + `"`);
            output.setImage(data.img);
            output.setColor("#ff9900");
            message.channel.send({
                embed: output
            });
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
    name: 'xkcd',
    description: 'Searches xkcd.com',
    uses: {
        commands: ["xkcd *###*/random",],
        descriptions: ["Find a random XKCD or a specific one by number. Default is the most recent one"]
    }
};