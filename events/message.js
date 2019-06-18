module.exports = (client, message) => {
  if (message.author.bot) {
    return;
  }
  const settings = message.settings = client.getGuildSettings(message.guild);
  const fs = require('fs');
  const fetch = require('node-fetch');
  const Discord = require('discord.js');
  const afkJson = fs.readFileSync('./afk.json');
  var afk = JSON.parse(afkJson);
  if (afk.length != 0) {
    for (i = 0; i < afk.length; i++) {
      if (afk[i].id == message.author.id && !message.content.startsWith(settings.prefix + "afk")) {
        var nick = message.guild.member(afk[i].id).displayName
        afk.splice(i, 1);
        fs.writeFileSync('./afk.json', JSON.stringify(afk));
        message.channel.send({
          embed: new Discord.RichEmbed().setTitle('Welcome back **' + nick + "**! I've removed your AFK status!").setColor("#ff9900")
        });
      }
      if (message.mentions.users.size > 0 && afk.length != 0 && message.guild.member(afk[i]) != null) {
        var nick = message.guild.member(afk[i].id).displayName
        if (message.author.id != afk[i].id && message.mentions.users.has(afk[i].id)) {
          message.channel.send({
            embed: new Discord.RichEmbed().setTitle('**' + nick + '** is AFK: **' + afk[i].reason + '**').setColor("#ff9900")
          })
        }
      }
    }
  }
  if (message.content.indexOf(settings.prefix) !== 0) {
    if (message.content.includes("r/") && !message.content.includes("http") && settings["redditPreviews"] == "true") {
      var tempArgs = message.content.trim().split(/ +/g);
      var subreddit = tempArgs.find(function (e) {
        return e.startsWith("r/")
      })
      if (subreddit != undefined) {
        fetch("https://www.reddit.com/" + message + ".json?limit=100&after=t3_10omtd/")
          .then(res => res.json())
          .then((out) => {
            var viewEmbed = new Discord.RichEmbed();
            viewEmbed.setTitle("Reddit says...");
            viewEmbed.setColor("#ff5900");
            viewEmbed.setThumbnail("https://2b97y11eflnx173v6x17pt0u-wpengine.netdna-ssl.com/wp-content/uploads/2018/01/12079890_10153682419958735_2551945902722283373_o.jpg");
            viewEmbed.addField(out.data.children[0].data.subreddit_name_prefixed, `https://www.reddit.com/` + message + "\n" + out.data.children[0].data.subreddit_subscribers + " subscribers");
            message.channel.send({ embed: viewEmbed });
          }).catch(err => { throw err });
      }
    }
    return;
  }
  const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;
  if (cmd && !message.guild && cmd.conf.guildOnly)
    return message.channel.send(client.alert("This command is unavailable via private message! Please run this command in a guild."));

  message.level = client.permLevel(message)
  var level = message.level
  if (client.config.levels[cmd.conf.permLevel] > message.level) {
    return message.channel.send(client.alert("You need to have a Perm Level of at least **" + client.levelName(client.config.levels[cmd.conf.permLevel]) + "** to run this command!"))
  }
  for (i = 0; i < cmd.conf.botPerms.length; i++) {
    if (!message.guild.me.hasPermission(cmd.conf.botPerms[i]))
      return message.channel.send(client.alert("I need the **" + cmd.conf.botPerms[i] + "** permission to run this command!\nContact an admin to grant me this permission!"))
  }
  client.logger.cmd(`[CMD] ${message.author.username} (${message.author.id}) ran command ${cmd.help.name}`);
  cmd.run(client, message, args, level);
};