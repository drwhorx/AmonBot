exports.run = async (client, message, args, level) => {
  const Discord = require("discord.js")
  const msg = await message.channel.send({ embed: client.inform("Ping?") });
  msg.edit({ embed: client.inform(`Pong! I am late to the party by ${msg.createdTimestamp - message.createdTimestamp}ms, fashionably. API Latency is ${Math.round(client.ping)}ms`) });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "USER",
  botPerms: []
};

exports.help = {
  name: "ping",
  description: "Checks if AmonBot is running correctly.",
  uses: {
    commands: ["ping"],
    descriptions: ["Ping AmonBot"]
  }
};
