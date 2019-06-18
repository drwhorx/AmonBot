exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    const fetch = require('node-fetch');
    var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + args.join("%20");
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            for (firstKey in out.query.pages) {
                if (out.query.pages[firstKey].extract === "") {
                    return message.channel.send({
                        embed: bot.alert("Could not find page, try capitalizing or rewording your phrase.")
                    });
                } else {
                    var field = out.query.pages[firstKey].extract
                    var splits = field.split(" ", 50)
                    var answer = splits.join(" ")
                    output = new Discord.RichEmbed();
                    output.addField("Wikipedia says...", answer + "...");
                    output.addField("To Read More...", "https://en.wikipedia.org/wiki/" + args.join("_"));
                    output.setColor("#ff9900");
                    message.channel.send({
                        embed: output
                    });
                }
            }
        })
        .catch(err => {
            throw err
        });

};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["wiki"],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'wikipedia',
    description: 'Search Wikipedia',
    uses: {
        commands: ["wikipedia *query*"],
        descriptions: ["Query Wikipedia for a search term"]
    }
};