const { inspect } = require("util");
exports.run = async (client, message, [action, key, ...value], level) => {
    const Discord = require("discord.js")
    const settings = message.settings;
    const overrides = client.settings.get(message.guild.id);
    if (action === "edit") {
        if (!key)
            return message.channel.send({ embed: client.alert("Please state a key.") });
        if (!settings[key])
            return message.channel.send({ embed: client.alert("That key does not exist.") });
        if (value.length < 1)
            return message.channel.send({ embed: client.alert("Please state a value.") });
        if (value.join(" ") === settings[key])
            return message.channel.send({ embed: client.alert("That key is already set to the current value.") });
        if (!client.settings.has(message.guild.id))
            client.settings.set(message.guild.id, {});
        client.settings.setProp(message.guild.id, key, value.join(" "));
        message.channel.send({ embed: client.success(key + " changed to " + value.join(" ")) });
    } else if (action === "reset") {
        if (!key)
            return message.channel.send({ embed: client.alert("Please state a key.") });
        if (!settings[key])
            return message.channel.send({ embed: client.alert("That key does not exist.") });
        if (!overrides[key])
            return message.channel.send({ embed: client.alert("That key is already at the default value.") });
        delete overrides[key];
        client.settings.set(message.guild.id, overrides);
        message.channel.send({ embed: client.success(key + " was reset.") });
    } else if (action === "get") {
        if (!key)
            return message.channel.send({ embed: client.alert("Please state a key.") });
        if (!settings[key])
            return message.channel.send({ embed: client.alert("That key does not exist.") });
        const isDefault = !overrides[key] ? "\nThis is the default global default value." : "";
        message.channel.send({ embed: client.inform("The value of " + key + " is currently " + settings[key] + isDefault) });
    } else {
        message.channel.send({ embed: new Discord.RichEmbed().addField("Current Server Settings:", inspect(settings)).setColor("#ff9900") });
    }
};

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["setting", "settings", "conf"],
    permLevel: "ADMIN",
    botPerms: []
};

exports.help = {
    name: "set",
    description: "View or change settings for your server.",
    uses: {
        commands: [
            "set",
            "set get *key*",
            "set edit *key* *value*",
            "set reset *key*"
        ],
        descriptions: [
            "View all the current settings",
            "Get a setting's value by its *key*",
            "Edit a setting to a given *value*",
            "Reset a setting's value"
        ]
    }
};