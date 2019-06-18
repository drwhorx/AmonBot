module.exports = (bot, err) => {
    const Discord = require("discord.js");
    const settings = bot.getGuildSettings(bot.guild);
    var fs = require("fs");
    fs.readFile('/home/pi/.pm2/logs/AmonBot-error.log', "utf8", (err, data) => {
    if (err) throw err;
    if(settings.botlogsChannel === "none") return console.log(data);
    bot.channels.get(settings.botlogsChannel).send({embed: new Discord.RichEmbed().addField("FATAL ERROR:", "`" + data + "`").setColor("#ff0000")});
    });
}