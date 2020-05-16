const { inspect } = require("util");
exports.run = async(bot, message, args, level) => {
    const Discord = require("discord.js")
    const settings = message.settings = bot.getGuildSettings(message.guild);
    const list = settings.givemelist;
    const splits = JSON.parse(list);
    if (!bot.settings.has(message.guild.id)) bot.settings.set(message.guild.id, {});
    if (args[0] == "list") {
        var listEmbed = new Discord.RichEmbed();
        const roles = splits.length == 0 ? "none" : splits.join("\n");
        listEmbed.addField("Roles for this server:", roles);
        listEmbed.setThumbnail(message.guild.iconURL);
        listEmbed.setFooter(`Roles available on ${message.guild.name}`);
        listEmbed.setColor("#ff9900");
        return message.channel.send({ embed: listEmbed })
    } else if (args[0] == "add") {
        if (message.level < 3)
            return message.channel.send(client.alert("You need to have a Perm Level of at least **Administrator** to run this command!"))
        const str = args.slice(1).join(" ");
        var roles = str.replace(/,+ +/gm, ",").trim().split(",");
        if (roles.length == 0)
            return message.channel.send({ embed: bot.alert("Please provide roles to add!") })
        var nonExist = []
        var already = []
        for (a = 0; a < roles.length; a++) {
            if (!message.guild.roles.find('name', roles[a])) {
                nonExist.push(roles.splice(a, 1))
            } else if (splits.indexOf(roles[a]) > -1) {
                already.push(roles.splice(a, 1))
            }
        }

        var updated = JSON.stringify(splits.concat(roles));
        bot.settings.setProp(message.guild.id, "givemelist", updated);

        var added = roles.sentence()
        var nonExistStr = nonExist.sentence()
        var alreadyStr = already.sentence()
        var errStr = ""

        if (nonExistStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${nonExistStr}** role${nonExistStr.includes("and") ? "s" : ""} ${nonExistStr.includes("and") ? "do" : "does"} not exist!`
        if (alreadyStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${alreadyStr}** role${alreadyStr.includes("and") ? "s" : ""} ${alreadyStr.includes("and") ? "are" : "is"} already on the giveme list!`
        if (errStr != "") {
            var errors = new Discord.RichEmbed().setColor("#ff0000")
            errors.addField(numErrs + " error" + (numErrs == 1 ? "" : "s") + " occured:", errStr)
            message.channel.send({ embed: errors })
        }
        if (added != "") {
            var successes = new Discord.RichEmbed().setColor("#00ff00")
            successes.addField(roles.length + " role" + (roles.length == 1 ? "" : "s") + " added!", `Successfully added the **${added}** role${added.includes("and") ? "s" : ""} to the giveme list!`)
            message.channel.send({ embed: successes })
        }
    } else if (args[0] == "delete") {
        if (message.level < 3)
            return message.channel.send(client.alert("You need to have a Perm Level of at least **Administrator** to run this command!"))
        const str = args.slice(1).join(" ");
        var roles = str.replace(/,+ +/gm, ",").trim().split(",");
        if (roles.length == 0)
            return message.channel.send({ embed: bot.alert("Please provide roles to delete!") })
        var nonExist = []
        var notGiveme = []
        for (a = 0; a < roles.length; a++) {
            if (!message.guild.roles.find('name', roles[a])) {
                nonExist.push(roles.splice(a, 1))
            } else if (splits.indexOf(roles[a]) == -1) {
                notGiveme.push(roles.splice(a, 1))
            }
        }

        var updated = JSON.stringify(splits.filter((e) => {
            return roles.indexOf(e) == -1
        }))

        bot.settings.setProp(message.guild.id, "givemelist", updated);

        var deleted = roles.sentence()
        var nonExistStr = nonExist.sentence()
        var notGivemeStr = notGiveme.sentence()
        var errStr = ""

        if (nonExistStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${nonExistStr}** role${nonExistStr.includes("and") ? "s" : ""} ${nonExistStr.includes("and") ? "do" : "does"} not exist!`
        if (notGivemeStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${notGivemeStr}** role${notGivemeStr.includes("and") ? "s" : ""} ${notGivemeStr.includes("and") ? "are" : "is"} not on the giveme list!`
        if (errStr != "") {
            var errors = new Discord.RichEmbed().setColor("#ff0000")
            errors.addField(numErrs + " error" + (numErrs == 1 ? "" : "s") + " occured:", errStr)
            message.channel.send({ embed: errors })
        }
        if (deleted != "") {
            var successes = new Discord.RichEmbed().setColor("#00ff00")
            successes.addField(roles.length + " role" + (roles.length == 1 ? "" : "s") + " deleted!", `Successfully deleted the **${deleted}** role${deleted.includes("and") ? "s" : ""} from the giveme list!`)
            message.channel.send({ embed: successes })
        }
    } else if (args[0] == "remove") {
        const str = args.slice(1).join(" ");
        var roles = str.replace(/,+ +/gm, ",").trim().split(",");
        if (roles.length == 0)
            return message.channel.send({ embed: bot.alert("Please provide roles to remove!") })
        var nonExist = []
        var dontHave = []
        var notGiveme = []
        for (a = 0; a < roles.length; a++) {
            if (!message.guild.roles.find('name', roles[a])) {
                nonExist.push(roles.splice(a, 1))
            } else if (!message.member.roles.find("name", roles[a])) {
                dontHave.push(roles.splice(a, 1))
            } else if (splits.indexOf(roles[a]) == -1) {
                notGiveme.push(roles.splice(a, 1))
            }
        }
        if (roles.length == 0) return;

        let taken = []
        let not = []
        for (a = 0; a < roles.length; a++) {
            let role = message.guild.roles.find("name", roleslist[c]);
            message.member.removeRole(role).then(m => {
                if (m.roles.has(role.id))
                    not.push(role.name)
                else
                    taken.push(role.name)
            }).catch(console.error);
        }
        var givenStr = given.sentence()
        var notStr = not.sentence()
        var nonExistStr = nonExist.sentence()
        var hadStr = had.sentence()
        var notGivemeStr = notGiveme.sentence()
        var numErrs = not.length + had.length + nonExist.length + notGiveme.length
        var errStr = ""
        if (notGivemeStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${notGivemeStr}** role${notGivemeStr.includes("and") ? "s" : ""} ${notGivemeStr.includes("and") ? "are" : "is"} not on the giveme list!`
        if (hadStr != "")
            errStr += (errStr == "" ? "" : "\n") + `You already had the **${hadStr}** role${hadStr.includes("and") ? "s" : ""}!`
        if (nonExistStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${nonExistStr}** role${nonExistStr.includes("and") ? "s" : ""} ${nonExistStr.includes("and") ? "do" : "does"} not exist!`
        if (notStr != "")
            errStr += (errStr == "" ? "" : "\n") + `Unable to add the **${notStr}** role${notStr.includes("and") ? "s" : ""}! This is most likely a permissions issue; contact an admin.`
        if (errStr != "") {
            var errors = new Discord.RichEmbed().setColor("#ff0000")
            errors.addField(numErrs + " error" + (numErrs == 1 ? "" : "s") + " occured:", errStr)
            message.channel.send({ embed: errors })
        }
        if (givenStr != "") {
            var successes = new Discord.RichEmbed().setColor("#00ff00")
            successes.addField(given.length + " role" + (given.length == 1 ? "" : "s") + " removed!", `Successfully removed the **${givenStr}** role${givenStr.includes("and") ? "s" : ""}!`)
            message.channel.send({ embed: successes })
        }
    } else {
        const str = args.join(" ");
        var roles = str.replace(/,+ +/gm, ",").trim().split(",");
        if (roles.length == 0)
            return message.channel.send({ embed: bot.alert("Please provide roles to add!") })
        var nonExist = []
        var had = []
        var notGiveme = []
        for (a = 0; a < roles.length; a++) {
            if (!message.guild.roles.find('name', roles[a])) {
                nonExist.push(roles.splice(a, 1))
            } else if (message.member.roles.find("name", roles[a])) {
                had.push(roles.splice(a, 1))
            } else if (splits.indexOf(roles[a]) == -1) {
                notGiveme.push(roles.splice(a, 1))
            }
        }
        let given = []
        let not = []
        for (a = 0; a < roles.length; a++) {
            let role = message.guild.roles.find("name", roleslist[c]);
            message.member.addRole(role).then(m => {
                if (m.roles.has(role.id))
                    given.push(role.name)
                else
                    not.push(role.name)
            }).catch(console.error);
        }
        var givenStr = given.sentence()
        var notStr = not.sentence()
        var nonExistStr = nonExist.sentence()
        var hadStr = had.sentence()
        var notGivemeStr = notGiveme.sentence()
        var numErrs = not.length + had.length + nonExist.length + notGiveme.length
        var errStr = ""
        if (notGivemeStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${notGivemeStr}** role${notGivemeStr.includes("and") ? "s" : ""} ${notGivemeStr.includes("and") ? "are" : "is"} not on the giveme list!`
        if (hadStr != "")
            errStr += (errStr == "" ? "" : "\n") + `You already had the **${hadStr}** role${hadStr.includes("and") ? "s" : ""}!`
        if (nonExistStr != "")
            errStr += (errStr == "" ? "" : "\n") + `The **${nonExistStr}** role${nonExistStr.includes("and") ? "s" : ""} ${nonExistStr.includes("and") ? "do" : "does"} not exist!`
        if (notStr != "")
            errStr += (errStr == "" ? "" : "\n") + `Unable to add the **${notStr}** role${notStr.includes("and") ? "s" : ""}! This is most likely a permissions issue; contact an admin.`
        if (errStr != "") {
            var errors = new Discord.RichEmbed().setColor("#ff0000")
            errors.addField(numErrs + " error" + (numErrs == 1 ? "" : "s") + " occured:", errStr)
            message.channel.send({ embed: errors })
        }
        if (givenStr != "") {
            var successes = new Discord.RichEmbed().setColor("#00ff00")
            successes.addField(given.length + " role" + (given.length == 1 ? "" : "s") + " given!", `Successfully given the **${givenStr}** role${givenStr.includes("and") ? "s" : ""}!`)
            message.channel.send({ embed: successes })
        }
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: "USER",
    botPerms: ["MANAGE_ROLES"]
};

exports.help = {
    name: 'giveme',
    description: 'Give yourself a role, or for admin, add and delete roles from the giveme list',
    uses: {
        commands: [
            "giveme list",
            "giveme *role1, role2, ...*",
            "giveme remove *role1, role2, ...*",
            "giveme add *role1, role2, ...*",
            "giveme delete *role1, role2, ...*"
        ],
        descriptions: [
            "Get a list of giveme roles in this server",
            "Assign yourself roles, given they are on the giveme list",
            "Remove roles from yourself, given they are on the giveme list",
            "Add roles to the giveme list (Server Admins only)",
            "Delete roles from the giveme list (Server Admins only)"
        ]
    }
};