exports.run = (bot, message, args, level) => {
    var alpha = require('node-wolfram');
    var Wolfram = new alpha('YKK4KA-J8TXG6AWXH');
    const Discord = require("discord.js");
    const question = args.join(" ");
    if (!question) {
        return message.channel.send({
            embed: new Discord.RichEmbed().setTitle("❌ Please state a search query!").setColor("#ff0000")
        });
    }
    Wolfram.query(question, function (err, result) {
        var answer = new Discord.RichEmbed();
        answer.setTitle("WolframAlpha Says...")
        answer.setColor("#FF9900")
        var link = encodeURIComponent(question).replace(/'/g,"%27").replace(/"/g,"%22")
        answer.setURL("https://www.wolframalpha.com/input/?i=" + link)
        message.channel.send({ embed: answer })
        if (err)
            console.log(err);
        else {
            for (var a = 0; a < result.queryresult.pod.length; a++) {
                var pod = result.queryresult.pod[a];
                const caption = pod.$.title;
                for (var b = 0; b < pod.subpod.length; b++) {
                    var subpod = pod.subpod[b];
                    for (var c = 0; c < subpod.img.length; c++) {
                        answer = new Discord.RichEmbed();
                        answer.setColor("#FF9900")
                        answer.setTitle(caption)
                        answer.setImage(subpod.img[c].$.src)
                        message.channel.send({ embed: answer })
                    }
                }
            }
        }
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
    name: 'wolfram',
    description: 'Queries the WolframAlpha database',
    usage: 'wolfram <your question>'
};
