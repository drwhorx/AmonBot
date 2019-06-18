exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    const execa = require('execa');
    const getStream = require('get-stream');
    const stream = execa("git", ["pull"]).stdout;
    stream.pipe(process.stdout);
    getStream(stream).then(value => {
        return message.channel.send({ embed: new Discord.RichEmbed().addField("`UPDATING...`", "`" + value + "`").setColor("#ff9900") });
    });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['git'],
    permLevel: "BOT_SUPPORT",
    botPerms: []
};

exports.help = {
    name: 'gitupdate',
    description: 'Updates AmonBot',
    uses: {
        commands: [],
        descriptions: []
    }
};
