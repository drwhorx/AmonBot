module.exports = async (client, messageReaction, user) => {
    const Discord = require('discord.js');
    let msg = messageReaction.message;
    const settings = client.getGuildSettings(msg.guild);
    if (settings.hofEnabled === "false") return;
    const emote = msg.guild.emojis.find("name", settings.hofEmote).id;
    const channel = msg.guild.channels.find("name", settings.hofChannel);
    if (user.me) return;
    if (messageReaction.emoji.id == emote && messageReaction.count >= settings.hofLimit) {
        msg.react(emote);
        const HoF = new Discord.RichEmbed();
        HoF.setColor(`${msg.member.displayHexColor}`)
            .setFooter('Hall of Fame 🏆')
            .setTimestamp()
        if (msg.member.nickname == null) {
            HoF.addField('User', `${msg.author.username}`, true)
        } else {
            HoF.addField('User', `${msg.member.nickname} (${msg.author.username})`, true);
        }
        HoF.addField('Channel', `${msg.channel.name}`, true)
        if (msg.attachments.size == 0) {
            HoF.addField('Message', `${msg}`)
        } else {
            pictures = msg.attachments.array();
            if (msg != "") {
                HoF.addField('Message', `${msg}`)
            }
            HoF.setImage(pictures[0].url)
        }
        channel.send({
            embed: HoF
        });
    }
    if (messageReaction.emoji.name == "❌" && msg.author.bot) {
        msg.delete()
    }
    if (msg.channel.id == "515279105197998097" && msg.author.bot && !user.bot) {
        var embed = msg.embeds[0]
        var index = -1;
        for (i = 0; i < embed.fields.length; i++) {
            if (embed.fields[i].name == "Drafter:") {
                index = i
            }
        }
        if (messageReaction.emoji.name == "🇦") {
            if (index == -1) {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Drafter:", "<@279282069304246272>")
                newEmbed.setColor("#ff9900")
                messageReaction.remove(user.id)
                msg.edit(newEmbed)
            } else {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Backup:", "<@279282069304246272>")
                newEmbed.setColor("#ff9900")
                msg.edit(newEmbed)
                msg.clearReactions()
            }
        } else if (messageReaction.emoji.name == "🇨") {
            if (index == -1) {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Drafter:", "<@511650226285576192>")
                newEmbed.setColor("#ff9900")
                messageReaction.remove(user.id)
                msg.edit(newEmbed)
            } else {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Backup:", "<@511650226285576192>")
                newEmbed.setColor("#ff9900")
                msg.edit(newEmbed)
                msg.clearReactions()
            }
        } else if (messageReaction.emoji.name == "🇷") {
            if (index == -1) {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Drafter:", "<@431563794993643551>")
                newEmbed.setColor("#ff9900")
                messageReaction.remove(user.id)
                msg.edit(newEmbed)
            } else {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Backup:", "<@431563794993643551>")
                newEmbed.setColor("#ff9900")
                msg.edit(newEmbed)
                msg.clearReactions()
            }
        } else if (messageReaction.emoji.name == "🇸") {
            if (index == -1) {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Drafter:", "<@223196189443620865>")
                newEmbed.setColor("#ff9900")
                messageReaction.remove(user.id)
                msg.edit(newEmbed)
            } else {
                var newEmbed = new Discord.RichEmbed()
                newEmbed.setTitle(embed.title)
                for (i = 0; i < embed.fields.length; i++) {
                    newEmbed.addField(embed.fields[i].name, embed.fields[i].value)
                }
                newEmbed.addField("Backup:", "<@223196189443620865>")
                newEmbed.setColor("#ff9900")
                msg.edit(newEmbed)
                msg.clearReactions()
            }
        }
    }
};