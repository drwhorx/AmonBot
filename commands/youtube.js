exports.run = (bot, message, args, level) => {
    const Discord = require("discord.js");
    var search = require('youtube-search');
    var youtubeThumbnail = require('youtube-thumbnail');
    const query = args.join(' ');
    var opts = {
        maxResults: 1,
        key: 'AIzaSyAICI9DWEEyuyxxltxQQDSclc-mkNzbbj4'
    };

    search(query, opts, function (err, results) {
        if (err) return console.log(err);

        var output = new Discord.RichEmbed();
        var thumbnail = youtubeThumbnail(results[0].link).high.url
        output.setThumbnail(thumbnail);
        output.setTitle('YouTube says...');
        output.addField('Title:', results[0].title);
        output.addField('Link:', results[0].link);
        output.addField('Channel:', results[0].channelTitle);
        output.setColor('#E53935');
        message.channel.send({ embed: output });
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
    name: 'youtube',
    description: 'Searches youtube',
    uses: {
        commands: ["youtube *search*"],
        descriptions: ["Query YouTube for a search term"]
    }
};

