exports.run = async (client, message, args, level) => {
  const Discord = require("discord.js")
  if (!args || args.length < 1) return message.channel.send({ embed: client.alert("Please state a command.") });

  let response = await client.unloadCommand(args[0]);
  if (response) return message.channel.send({ embed: client.alert("Error Unloading: " + response) });

  response = client.loadCommand(args[0]);
  if (response) return message.channel.send({ embed: client.alert("Error Loading: " + response) });

  message.channel.send({ embed: client.success("The command `" + args[0] + "` has been reloaded") });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "BOT_SUPPORT",
  botPerms: []
};

exports.help = {
  name: "reload",
  description: "Reloads a command thats been modified.",
  uses: {
    commands: ["reload *command*"],
    descriptions: ["Reloads a given *command*"]
  }
};
