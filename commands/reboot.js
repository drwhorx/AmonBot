exports.run = async (client, message, args, level) => {
  const Discord = require("discord.js");
  await message.channel.send({ embed: new Discord.RichEmbed().setTitle("💭 Bot is rebooting...").setColor("#ff9900") });
  client.commands.forEach(async cmd => {
    await client.unloadCommand(cmd);
  });
  process.exit(1);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "BOT_ADMIN",
  botPerms: []
};

exports.help = {
  name: "reboot",
  description: "Reboots the bot.",
  uses: {
    commands: ["reboot"],
    descriptions: ["Reboot AmonBot"]
  }
};
