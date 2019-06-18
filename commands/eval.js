exports.run = async (client, message, args, level) => {
  const Discord = require("discord.js")
  const code = args.join(" ");
  try {
    const evaled = eval("function myFunction() {" + code + "};" + "\nmyFunction()");
    console.log(evaled)
    message.channel.send({ embed: new Discord.RichEmbed().addField("Output:", `\`\`\`js\n${evaled}\n\`\`\``).setColor("#00ff00") });
  } catch (err) {
    console.log(err)
    message.channel.send({ embed: new Discord.RichEmbed().addField("ERROR", `\`\`\`xl\n${err}\n\`\`\``).setColor("#ff0000") });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: "BOT_OWNER",
  botPerms: []
};

exports.help = {
  name: "eval",
  description: "Evaluates arbitrary javascript.",
  uses: {
    commands: ["eval *code*"],
    descriptions: ["Evaluates *code* in Node.js"]
  }
};
