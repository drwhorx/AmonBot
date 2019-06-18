exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    if (!args[0].startsWith("r/")) args[0] = "r/" + args[0]
    if (args[1] === "top") {
        var url = "https://www.reddit.com/" + args[0] + "/top/.json?sort=top&t=all&limit=100";
    } else {
        var url = "https://www.reddit.com/" + args[0] + ".json?limit=100&after=t3_10omtd/";
    }
    const fetch = require('node-fetch');
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            if (args[1] === "new") {
                if (!args[2]) {
                    var page = 1
                } else if (args[2] === "random") {
                    var page = Math.floor(Math.random() * 100)
                } else {
                    var page = args[2]
                }
                const viewEmbed = new Discord.RichEmbed();
                viewEmbed.setTitle("Reddit says...");
                if (!out.data.children[page].data.selftext) {
                    viewEmbed.addField(out.data.children[page].data.title, "⬆ " + out.data.children[page].data.ups + " ⬇");
                } else {
                    viewEmbed.addField(out.data.children[page].data.title, out.data.children[page].data.selftext + "\n" + "⬆ " + out.data.children[page].data.ups + " ⬇");
                }
                if (!out.data.children[page].data.preview) {
                    viewEmbed.setFooter("u/" + out.data.children[page].data.author);
                } else {
                    viewEmbed.setFooter("u/" + out.data.children[page].data.author);
                    viewEmbed.setImage(out.data.children[page].data.preview.images[0].source.url)
                }
                viewEmbed.setColor("#ff5900");
                message.channel.send({
                    embed: viewEmbed
                });
                viewEmbed.setColor("#ff9900");
            } else if (args[1] === "top") {
                if (!args[2]) {
                    var page = 1
                } else if (args[2] === "random") {
                    var page = Math.floor(Math.random() * 100)
                } else {
                    var page = args[2]
                }
                const viewEmbed = new Discord.RichEmbed();
                viewEmbed.setTitle("Reddit says...");
                if (!out.data.children[page].data.selftext) {
                    viewEmbed.addField(out.data.children[page].data.title, "⬆ " + out.data.children[page].data.ups + "️ ⬇");
                } else {
                    viewEmbed.addField(out.data.children[page].data.title, out.data.children[page].data.selftext + "\n" + "⬆ ️" + out.data.children[page].data.ups + " ⬇");
                }
                if (!out.data.children[page].data.preview) {
                    viewEmbed.setFooter("u/" + out.data.children[page].data.author);
                } else {
                    viewEmbed.setFooter("u/" + out.data.children[page].data.author);
                    viewEmbed.setImage(out.data.children[page].data.preview.images[0].source.url)
                }
                viewEmbed.setColor("#ff5900");
                message.channel.send({
                    embed: viewEmbed
                });
            } else {
                const viewEmbed = new Discord.RichEmbed();
                viewEmbed.setTitle("Reddit says...");
                viewEmbed.setColor("#ff5900");
                viewEmbed.setThumbnail("https://2b97y11eflnx173v6x17pt0u-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/12079890_10153682419958735_2551945902722283373_o.jpg");
                viewEmbed.addField(out.data.children[0].data.subreddit_name_prefixed, `https://www.reddit.com/` + args[0] + "\n" + out.data.children[0].data.subreddit_subscribers + " subscribers");
                message.channel.send({
                    embed: viewEmbed
                });
            }
        })
        .catch(err => {
            throw err
        });

};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['r'],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'reddit',
    description: 'Browse the last 100 posts in a subreddit or view its stats',
    uses: {
        commands: [
            "reddit *subreddit*",
            "reddit *subreddit* new *###*/random",
            "reddit *subreddit* top *###*/random"
        ],
        descriptions: [
            "See the stats on a given *subreddit*",
            "Get the nth or random newest post on a given *subreddit*. Default is 1st",
            "Get the nth or random top all time post on a given *subreddit*. Default is 1st"
        ]
    }
};