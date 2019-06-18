exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    const ud = require('urban-dictionary');
    var query = args.join(" ");
    ud.term(query).then((result) => {
        const entries = result.entries
        var urban = new Discord.RichEmbed()
            .setTitle("Urban Dictionary Says...")
            .addField('Word:', entries[0].word)
            .addField('Definition:', entries[0].definition)
            .addField('Examples:', entries[0].example)
            .setColor('#FF9900')
        message.channel.send({ embed: urban })
    })
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'urban',
    description: 'Searches the Urban Dictionary',
    uses: {
        commands: ["urban *query*"],
        descriptions: ["Queries the Urban Dictionary for a search term"]
    }
};
