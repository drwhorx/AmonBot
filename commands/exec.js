exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    const execa = require('execa');
    const getStream = require('get-stream');
    if (message.author.id == "279282069304246272") {
        if (!args[0]) {
            return message.channel.send({ embed: bot.alert("Please specify a command.") });
        } else {
            const stream = execa.shell(args.join(" ")).stdout;
            stream.pipe(process.stdout);
            getStream(stream).then(value => {
                return message.channel.send({ embed: new Discord.RichEmbed().addField("Console Output:", "```\n" + value + "\n```").setColor("#ff9900") });
            });
        }
    } else {
        return message.channel.send({ embed: bot.alert("You do not have permission.") });
    }
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["ex"],
    permLevel: "BOT_OWNER",
    botPerms: []
};

exports.help = {
    name: 'exec',
    description: 'Execute command in terminal. Only available to the Bot Owner',
    uses: {
        commands: ["exec *command*"],
        descriptions: ["Execute *command* in the terminal"]
    }
};