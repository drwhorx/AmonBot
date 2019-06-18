exports.run = async (bot, message, args, level) => {
    const Discord = require('discord.js');
    const settings = message.settings = bot.getGuildSettings(message.guild);
    if (!args[0]) {
        var intro = new Discord.RichEmbed()
            .setTitle("Command List")
            .addField("AmonBot v2.0", "Creator: drwhorx#5533\nGithub: https://github.com/drwhorx/AmonBot\nIssues: https://github.com/drwhorx/AmonBot/issues")
        const pages = [intro]
        var commands = bot.commands.array()

        for (i = 0; i < commands.length; i++) {
            var pg = new Discord.RichEmbed()
            for (c = 0; c < 5 && i < commands.length; c++) {
                pg.addField(commands[i].help.name, commands[i].help.description)
                i++
            }
            pages.push(pg)
        }
        for (i = 0; i < pages.length; i++) {
            pages[i].setColor("#ff9900").setDescription("Page " + (i + 1) + " of " + pages.length)
        }

        var options = {
            limit: 15 * 1000,
            min: 0,
            max: pages.length,
            page: 0
        }
        const m = await message.channel.send({ embed: pages[options.page] });
        await m.react('◀');
        await m.react('▶');
        await m.react('🗑');
        const removeReaction = async (m, msg, emoji) => {
            try { m.reactions.find(r => r.emoji.name == emoji).remove(msg.author.id); } catch(err) {console.log(err)}
        }
        const filter = (reaction, user) => {
            return ['◀', '▶', '🗑'].includes(reaction.emoji.name) && user.id == message.author.id;
        };
        const awaitReactions = async (msg, m, options, filter) => {
            var { min, max, page, limit } = options;
            m.awaitReactions(filter, { max: 1, time: limit, errors: ['time'] })
                .then(async (collected) => {
                    console.log("before: " + page)
                    const reaction = collected.first();
                    const chosen = reaction.emoji.name;
                    if (chosen === "◀") {
                        await removeReaction(m, msg, '◀');
                        if (page != min) {
                            page--;
                            await m.edit({ embed: pages[page] });
                        }
                        options = { min, max, page, limit }
                        console.log("after: " + page)
                        awaitReactions(msg, m, options, filter);
                    } else if (chosen === "▶") {
                        await removeReaction(m, msg, '▶');
                        if (page != max) {
                            page++;
                            await m.edit({ embed: pages[page] });
                        }
                        options = { min, max, page, limit }
                        console.log("after: " + page)
                        awaitReactions(msg, m, options, filter);
                    } else if (chosen === "🗑") {
                        m.clearReactions()
                    } else {
                        awaitReactions(msg, m, options, filter);
                    }
                }).catch((err) => { 
                    console.log(err)
                });
        }
        awaitReactions(message, m, options, filter);
    } else {
        let command = '';
        if (bot.commands.has(args[0])) {
            command = bot.commands.get(args[0]);
        } else if (bot.aliases.has(args[0])) {
            command = bot.commands.get(bot.aliases.get(args[0]));
        };
        if (!command)
            return message.channel.send({ embed: bot.alert("That command does not exist.") });
        var helpCommand = new Discord.RichEmbed()
            .setTitle(command.help.name)
            .addField('Description:', command.help.description)
            .setColor("#ff9900")
        try {
            for (i = 0; i < command.help.uses.commands.length; i++)
            helpCommand.addField(settings.prefix + command.help.uses.commands[i], command.help.uses.descriptions[i]);
        } catch (err) {
            console.log(err)
        }
        if (command.conf.aliases.length != 0)
            helpCommand.addField('Aliases:', command.conf.aliases.join(', '));
        message.channel.send({
            embed: helpCommand
        });
    };
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['h'],
    permLevel: "USER",
    botPerms: []
};
exports.help = {
    name: 'help',
    description: 'Shows the available commands on this server and their uses',
    uses: {
        commands: ["help", "help *command*"],
        descriptions: ["Lists all commands", "Lists multiple use cases for a given *command*"]
    }
};
