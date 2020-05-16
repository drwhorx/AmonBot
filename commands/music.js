exports.run = async (bot, message, args, level) => {
    const Discord = require("discord.js");
    const fs = require('fs');
    const ytdl = require('ytdl-core');
    const YouTube = require('simple-youtube-api')
    const youtube = new YouTube(bot.config.yt_key);
    const ytlist = require('youtube-playlist');
    const titleCard = new Discord.RichEmbed()
        .setTitle("AmonBot Music Panel!")
        .addField("⏮/▶/⏸/⏭", "Pause/Play/Skip Forward/Back")
        .addField("📼", "Load/Save/Delete a mixtape")
        .addField("↗/❌", "Insert/Delete a song in queue")
        .addField("ℹ", "List the up next in queue", true)
        .addField("⤵", "Bring this message down to the bottom of chat", true)
        .addField("❓", "Show/Hide the help panel", true)
        .addField("⏹", "Stop this program", true)
        .setColor("#E53935")

    const loadingCard = new Discord.RichEmbed()
        .setTitle("Loading...")
        .setColor("#E53935")

    const exitCard = new Discord.RichEmbed()
        .setTitle("Exited process")
        .setColor("#E53935")

    var m;
    var emotes = ['⤵', '⏹', '❓', 'ℹ', '⏮', '▶', '⏸', '⏭', '📼', '↗', '❌']
    async function setup() {
        if (m != undefined) await m.delete();
        m = await message.channel.send({ embed: loadingCard });
        for (i = 0; i < emotes.length; i++) {
            await m.react(emotes[i])
        }
        return await m.edit({ embed: titleCard }).then(changed => { return changed })
    }
    m = await setup()
    var queue = []
    var connection;
    var dispatcher;
    var exited = false;
    var unchanged = false;
    const removeReaction = async (m, msg, emoji) => {
        try { m.reactions.find(r => r.emoji.name == emoji).remove(msg.author.id); } catch (err) { }
    }
    const filter = (reaction, user) => {
        return emotes.includes(reaction.emoji.name) && message.author.id == user.id;
    };
    async function presence() {
        return (await message.guild.fetchMember(message.member)).voiceChannel
    }
    function isTitleCard(m) {
        return m.embeds[0].title == "AmonBot Music Panel!"
    }
    function mapFields(embed) {
        return embed.fields.map((e) => {
            return {
                name: e.name,
                value: e.value
            }
        })
    }
    function copyEmbed(embed, options) {
        options == undefined ? options = {} : options
        var newEmbed = new Discord.RichEmbed({
            title: options.title ? options.title : embed.title,
            fields: options.fields ? options.fields : mapFields(embed)
        }).setColor(options.color ? options.color : embed.color)
        if (options.thumbnail)
            newEmbed.setThumbnail(options.thumbnail);
        else if (embed.thumbnail)
            newEmbed.setThumbnail(embed.thumbnail.url);

        if (options.url)
            newEmbed.setURL(options.url);
        else if (embed.url)
            newEmbed.setURL(embed.url);
        return newEmbed
    }
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function sendmessage(msg, options) {
        var { limit, color, title, text, succeed } = options
        if (color == undefined) color = msg.embeds[0].color;
        if (limit == undefined) limit = 3000;
        if (succeed) {
            color = 0x00ff00;
            title = "✅ " + title;
        } else if (succeed == false) {
            color = 0xff0000;
            title = "❌ " + title;
        }
        var embed;
        if (text != undefined)
            embed = { fields: [{ name: title, value: text }], color: color };
        else
            embed = { title: title, color: color };
        return await msg.channel.send({ embed: embed }).then(async changed => {
            await timeout(limit)
            return await changed.delete()
        })
    }
    async function reqmessage(msg, options) {
        const wait = m => m.author.id == message.author.id;
        var { title, text, confirm, check, failed, callback } = options
        if (check == undefined) check = ans => true;
        var embed = {
            color: msg.embeds[0].color,
            footer: {
                text: "You may reply \"cancel\" at anytime to cancel a command."
            }
        }
        if (text != undefined)
            embed.fields = [{ name: title, value: text }];
        else
            embed.title = title;
        return await msg.channel.send({ embed: embed }).then(async sent => {
            try {
                var collected = await sent.channel.awaitMessages(wait, { max: 1, time: 60000, errors: ["time"] });
                var content = collected.first().content
                if (content.toLowerCase() == "cancel") throw "";
                if (confirm != false) {
                    await sent.delete()
                    await sendmessage(msg, {
                        title: "You submitted...",
                        text: `\`${content}\``,
                        limit: 2000
                    })
                    sent = undefined;
                }
                if (check(content)) {
                    if (typeof callback == "string")
                        await sendmessage(msg, {
                            title: onSucceed,
                            succeed: true
                        })
                    else if (callback) await callback(content);
                    if (sent != undefined) return await sent.delete().then(() => { return content });
                    return content;
                } else {
                    if (failed)
                        await sendmessage(msg, {
                            title: failed,
                            succeed: false,
                            limit: 2000
                        })
                    options = { title, text, confirm, check, failed, callback }
                    return await reqmessage(msg, options)
                }
            } catch (err) {
                await sendmessage(msg, { title: "Cancelled" })
                return await sent.delete().then(() => { return undefined })
            }
        })
    }
    function playingCard(options) {
        if (options == undefined) options = {};
        var fields;
        if (options.author == undefined)
            fields = [{ name: "None", value: "Try adding something to the queue or pressing play!" }];
        else
            fields = [{ name: options.title, value: options.author }]
        return {
            title: "Now Playing...",
            color: 0xE53935,
            url: options.link,
            thumbnail: {
                url: options.thumbnail
            },
            fields: fields
        }
    }
    async function editPlaying(options) {
        var embed = m.embeds[0]
        var fields = mapFields(embed)
        fields[0] = {
            name: options.title,
            value: options.author
        }
        embed = {
            title: embed.title,
            color: embed.color,
            url: options.link,
            thumbnail: {
                url: options.thumbnail
            },
            fields: fields
        }
        playingEmbed = embed;
        m = await m.edit({ embed: embed }).then(changed => { return changed })
    }
    async function play() {
        var song = queue[playing]
        queue[playing].status = "PLAYING"
        dispatcher = connection.playStream(ytdl(song.link, {
            filter: "audioonly"
        })).on("end", async reason => {
            console.log(reason)
            queue[playing].status = "QUEUE"
            if (reason == "user") return;
            if (playing + 2 > queue.length) playing = 0;
            else playing++;
            if (!await presence())
                bot.alert("You left the voice channel.")
            else
                play(queue[playing], playing)
        })
        return await editPlaying({
            link: song.link,
            thumbnail: song.thumbnail,
            author: song.author,
            title: song.title
        })
    }
    var playing;
    var playingEmbed = playingCard()
    const awaitReactions = async (msg, m, filter) => {
        if (exited) return;
        m.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(async (collected) => {
                const reaction = collected.first();
                const chosen = reaction.emoji.name;
                if (["▶", "⏸", "⏭", "⏮", "↗", "📼"].includes(chosen)) {
                    if (!await presence()) {
                        await sendmessage(m, {
                            title: "You are not in a voice channel!",
                            succeed: false,
                        })
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    }
                    if (connection == undefined) connection = await (await presence()).join();
                }
                if (["▶", "⏸", "⏭", "⏮", "ℹ", "↗", "📼"].includes(chosen)) {
                    if (isTitleCard(m)) m = await m.edit({ embed: playingEmbed }).then(changed => { return changed })
                }
                if (chosen === "▶") {
                    if (dispatcher == undefined && queue.length == 0) {
                        await sendmessage(m, {
                            title: "There is nothing to play!",
                            succeed: false
                        })
                    } else if (dispatcher != undefined && !dispatcher.paused) {
                        await sendmessage(m, {
                            title: "Music is already playing!",
                            succeed: false
                        })
                    } else if (dispatcher != undefined && dispatcher.paused) {
                        dispatcher.resume()
                        await sendmessage(m, {
                            title: "Music resumed!",
                            succeed: true
                        })
                    } else {
                        playing = 0;
                        await play()
                        await sendmessage(m, {
                            title: "Music now playing!",
                            succeed: true
                        })
                    }
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "⏸") {
                    if (dispatcher == undefined) {
                        await sendmessage(m, {
                            title: "There is nothing playing!",
                            succeed: false
                        })
                    } else if (dispatcher != undefined && dispatcher.paused) {
                        await sendmessage(m, {
                            title: "Music is already paused!",
                            succeed: false
                        })
                    } else if (dispatcher != undefined && !dispatcher.paused) {
                        dispatcher.pause()
                        await sendmessage(m, {
                            title: "Music is paused!",
                            succeed: true
                        })
                    }
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "⏮") {
                    if (dispatcher == undefined) {
                        await sendmessage(m, {
                            title: "There is nothing playing!",
                            succeed: false
                        })
                    } else if (queue.length == 0) {
                        await sendmessage(m, {
                            title: "There isn't anything in the queue!",
                            succeed: false
                        })
                    } else if (queue.length == 1) {
                        dispatcher.end()
                        await play(queue[0], 0)
                        await sendmessage(m, {
                            title: "Song has been restarted!",
                            succeed: true
                        })
                    } else {
                        var index = queue.findIndex((e) => {
                            return e.status == "PLAYING"
                        })
                        if (index == 0) index = queue.length - 1;
                        else index = index - 1;
                        dispatcher.end()
                        await play(queue[index], index)
                        await sendmessage(m, {
                            title: "Now playing the previous track!",
                            succeed: true
                        })
                    }
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "⏭") {
                    if (dispatcher == undefined) {
                        await sendmessage(m, {
                            title: "There is nothing playing!",
                            succeed: false
                        })
                    } else if (queue.length == 0) {
                        await sendmessage(m, {
                            title: "There isn't anything in the queue!",
                            succeed: false
                        })
                    } else if (queue.length == 1) {
                        dispatcher.end()
                        await play(queue[0], 0)
                        await sendmessage(m, {
                            title: "Song has been restarted!",
                            succeed: true
                        })
                    } else {
                        var index = queue.findIndex((e) => {
                            return e.status == "PLAYING"
                        })
                        if (index == queue.length - 1) index = 0;
                        else index = index + 1;
                        dispatcher.end()
                        await play(queue[index], index)
                        await sendmessage(m, {
                            title: "Now playing the next track!",
                            succeed: true
                        })
                    }
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "ℹ") {
                    var text = queue.map((e, i) => {
                        return `${i + 1}: ${e.status == "PLAYING" ? "(Now playing)" : ""} ${e.title}`
                    }).join("\n")
                    if (text == "") text = "Nothing up next in queue!"
                    await reqmessage(m, {
                        title: "Up next in queue: (message anything to continue)",
                        text: text,
                        confirm: false
                    })
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "↗") {
                    unchanged = false;
                    var songs = await reqmessage(m, { title: "Please provide songs separated by commas:" })
                    if (songs == undefined) {
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    }

                    var text = queue.map((e, i) => {
                        return `${i + 1}: ${e.title}`
                    }).join("\n")
                    text += "\n" + (queue.length + 1) + ":"
                    var pos = await reqmessage(m, {
                        title: "Where would you like to insert this song?",
                        text: text,
                        check: ans => ans - 1 != NaN && ans - 1 >= 0 && ans - 2 < queue.length,
                        failed: "Invalid Position!"
                    })
                    if (pos == undefined) {
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    }
                    songs = songs.replace(/,+ +/gm, ",").trim().split(",");

                    var vids = []
                    for (s = 0; s < songs.length; s++) {
                        var song = songs[s]
                        if (song.trim() == "") {
                            songs.splice(s, 1);
                            continue;
                        }
                        var results
                        if (song.includes("http")) {
                            try {
                                results = await youtube.getVideo(song)
                            } catch (err) {
                                try {
                                    results = await youtube.getPlaylist(song)
                                } catch (err) {
                                    results = await youtube.search(song, 15)
                                }
                            }
                        } else {
                            results = await youtube.search(song, 15)
                        }
                        if (!Array.isArray(results)) results = [results]
                        results = results.filter(e => e.type == "video" || e.type == "playlist")
                        if (results.length > 10) results = results.splice(0, 10);
                        text = results.map((e, i) => {
                            return `${i + 1}: ${e.type == "video" ? "(Video)" : "(Playlist)"} ${e.title}`
                        }).join("\n")
                        if (text == "") {
                            await sendmessage(m, {
                                title: `No YouTube search results found for "${song}"`,
                                succeed: false,
                                limit: 2000
                            })
                            continue;
                        }

                        var result = await reqmessage(m, {
                            title: "Choose a result:",
                            text: text,
                            check: ans => ans - 1 != NaN && ans - 1 >= 0 && ans - 1 < results.length,
                            failed: "Invalid Position!"
                        })
                        if (result == undefined) {
                            songs.splice(s, 1);
                            continue;
                        }

                        result = results[result - 1];
                        if (result.type == "video") {
                            var data = await youtube.getVideoByID(result.id)
                            vids.push({
                                id: result.id,
                                link: "https://youtube.com/watch?v=" + result.id,
                                title: data.title,
                                author: data.channel.title,
                                thumbnail: data.thumbnails.medium.url + "",
                                status: "QUEUE"
                            })
                        } else {
                            var list = await ytlist("https://www.youtube.com/playlist?list=" + result.id, "id")
                            vids = list.data.playlist.map(async (e) => {
                                var data = await youtube.getVideoByID(e)
                                return {
                                    id: e,
                                    link: "https://youtube.com/watch?v=" + e,
                                    title: data.title,
                                    author: data.channel.title,
                                    thumbnail: data.thumbnails.medium.url + "",
                                    status: "QUEUE"
                                }
                            })
                        }
                    }

                    for (i = 0; i < vids.length; i++) {
                        queue.splice(pos - 1, 0, vids[i])
                    }
                    if (vids.length != 0)
                        await sendmessage(m, {
                            title: `${vids.length} video${vids.length == 1 ? "" : "s"} added to the queue!`,
                            succeed: true
                        })

                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "⤵") {
                    m = await setup()
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "📼") {
                    var option = await reqmessage(m, {
                        title: "Would you like to load, save, or delete a mixtape?",
                        text: "load/save/delete",
                        check: ans => ["load", "save", "delete"].includes(ans.toLowerCase()),
                        failed: "Invalid answer!",
                        confirm: false
                    })
                    if (option.toLowerCase() == "save") {
                        var name = await reqmessage(m, { title: "Please provide a name for this mixtape:" })
                        if (name == undefined) {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }
                        name = name.toLowerCase()
                        var user = message.author.id
                        var existing = JSON.parse(fs.readFileSync("./mixtape.json"))
                        var overwrite = true;
                        if (existing[user] == undefined) existing[user] = {};
                        while (existing[user][name] != undefined) {
                            var answer = await reqmessage(m, {
                                title: "A mixtape of this name already exists, would you like to overwrite it?",
                                text: "yes/no",
                                check: ans => ["yes", "no"].includes(ans.toLowerCase()),
                                failed: "Invalid answer!",
                                confirm: false
                            })
                            if (answer.toLowerCase() == "yes") {
                                break;
                            } else if (answer.toLowerCase() == "no") {
                                name = await reqmessage(m, { title: "Please provide a new name for this mixtape:" })
                            } else if (answer.toLowerCase() == undefined) {
                                overwrite = false;
                                break;
                            }
                        }
                        if (!overwrite) {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }

                        existing[user][name] = queue;
                        fs.writeFileSync("./mixtape.json", JSON.stringify(existing))
                        await sendmessage(m, {
                            title: `Queue saved under name "${name}"`,
                            succeed: true
                        })
                        unchanged = true;
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    } else if (option.toLowerCase() == "load") {
                        var user = message.author.id
                        var mixes = JSON.parse(fs.readFileSync("./mixtape.json"))
                        if (mixes[user] == undefined || Object.values(mixes[user]).length == 0) {
                            await sendmessage(m, {
                                title: "You do not have any mixtapes!",
                                succeed: false
                            })
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }

                        var saved = Object.keys(mixes[user])
                        var text = saved.map((e, i) => {
                            return `${i + 1}: ${e}`
                        }).join("\n")
                        var pos = await reqmessage(m, {
                            title: "Choose a mixtape by its index:",
                            text: text,
                            check: ans => ans - 1 != NaN && ans - 1 >= 0 && ans - 1 < saved.length,
                            failed: "Invalid Position!"
                        })
                        if (pos == undefined) {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }

                        var mix = mixes[user][saved[pos - 1]]
                        if (queue.length != 0) {
                            var answer = await reqmessage(m, {
                                title: "Are you sure you want to erase the existing queue?\nYou may also choose to save this queue as a mixtape",
                                text: "yes/no/save",
                                check: ans => ["yes", "no", "save"].includes(ans.toLowerCase()),
                                failed: "Invalid answer!",
                                confirm: false
                            })
                            if (answer == undefined) {
                                await removeReaction(m, msg, chosen);
                                return awaitReactions(msg, m, filter);
                            }
                            answer = answer.toLowerCase()
                            if (answer == "save") {
                                var name = await reqmessage(m, { title: "Please provide a name for this mixtape:" })
                                if (name == undefined) {
                                    await removeReaction(m, msg, chosen);
                                    return awaitReactions(msg, m, filter);
                                }
                                name = name.toLowerCase()
                                var user = message.author.id
                                var existing = JSON.parse(fs.readFileSync("./mixtape.json"))
                                var overwrite = true;
                                if (existing[user] == undefined) existing[user] = {};
                                while (existing[user][name] != undefined) {
                                    var answer = await reqmessage(m, {
                                        title: "A mixtape of this name already exists, would you like to overwrite it?",
                                        text: "yes/no",
                                        check: ans => ["yes", "no"].includes(ans.toLowerCase()),
                                        failed: "Invalid answer!",
                                        confirm: false
                                    })
                                    if (answer.toLowerCase() == "yes") {
                                        break;
                                    } else if (answer.toLowerCase() == "no") {
                                        name = await reqmessage(m, { title: "Please provide a new name for this mixtape:" })
                                    } else if (answer.toLowerCase() == undefined) {
                                        overwrite = false;
                                        break;
                                    }
                                }
                                if (!overwrite) {
                                    await removeReaction(m, msg, chosen);
                                    return awaitReactions(msg, m, filter);
                                }

                                existing[user][name] = queue;
                                fs.writeFileSync("./mixtape.json", JSON.stringify(existing))
                                await sendmessage(m, {
                                    title: `Queue saved under name "${name}"`,
                                    succeed: true
                                })
                            } else if (answer != "yes") {
                                await removeReaction(m, msg, chosen);
                                return awaitReactions(msg, m, filter);
                            }
                        }
                        queue = mix.slice(0);
                        await sendmessage(m, {
                            title: "Mixtape loaded!",
                            color: 0x00ff00
                        })
                        unchanged = true;
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    } else if (option.toLowerCase() == "delete") {
                        var user = message.author.id
                        var mixes = JSON.parse(fs.readFileSync("./mixtape.json"))
                        if (mixes[user] == undefined || Object.values(mixes[user]).length == 0) {
                            await sendmessage(m, {
                                title: "You do not have any mixtapes!",
                                succeed: false
                            })
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }
                        var saved = Object.keys(mixes[user])
                        var text = saved.map((e, i) => {
                            return `${i + 1}: ${e}`
                        }).join("\n")
                        var pos = await reqmessage(m, {
                            title: "Choose a mixtape by its index:",
                            text: text,
                            check: ans => ans - 1 != NaN && ans - 1 >= 0 && ans - 1 < saved.length,
                            failed: "Invalid Position!"
                        })
                        if (pos == undefined) {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }
                        await reqmessage(m, {
                            title: `Are you sure you want to delete mixtape titled "${saved[pos - 1]}"?`,
                            text: "yes/no",
                            confirm: false,
                            check: ans => ["yes", "no"].includes(ans.toLowerCase()),
                            callback: async ans => {
                                delete mixes[user][saved[pos - 1]]
                                await sendmessage(m, {
                                    title: "Mixtape deleted!",
                                    succeed: true
                                })
                                fs.writeFileSync("./mixtape.json", JSON.stringify(mixes))
                            },
                            failed: "Invalid answer!"
                        })
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    } else {
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    }
                } else if (chosen === "⏹") {
                    var answer
                    if (queue.length != 0 && unchanged == false) {
                        var existing = JSON.parse(fs.readFileSync("./mixtape.json"))
                        var answer = await reqmessage(m, {
                            title: "Are you sure you want to erase the existing queue?\nYou may also choose to save this queue as a mixtape",
                            text: "yes/no/save",
                            check: ans => ["yes", "no", "save"].includes(ans.toLowerCase()),
                            failed: "Invalid answer!",
                            confirm: false
                        })
                        if (answer == undefined) {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }
                        answer = answer.toLowerCase()
                        if (answer == "save") {
                            var name = await reqmessage(m, { title: "Please provide a name for this mixtape:" })
                            if (name == undefined) {
                                await removeReaction(m, msg, chosen);
                                return awaitReactions(msg, m, filter);
                            }
                            name = name.toLowerCase()
                            var user = message.author.id
                            var overwrite = true;
                            if (existing[user] == undefined) existing[user] = {};
                            while (existing[user][name] != undefined) {
                                var answer = await reqmessage(m, {
                                    title: "A mixtape of this name already exists, would you like to overwrite it?",
                                    text: "yes/no",
                                    check: ans => ["yes", "no"].includes(ans.toLowerCase()),
                                    failed: "Invalid answer!",
                                    confirm: false
                                })
                                if (answer.toLowerCase() == "yes") {
                                    break;
                                } else if (answer.toLowerCase() == "no") {
                                    name = await reqmessage(m, { title: "Please provide a new name for this mixtape:" })
                                } else if (answer.toLowerCase() == undefined) {
                                    overwrite = false;
                                    break;
                                }
                            }
                            if (!overwrite) {
                                await removeReaction(m, msg, chosen);
                                return awaitReactions(msg, m, filter);
                            }

                            existing[user][name] = queue;
                            fs.writeFileSync("./mixtape.json", JSON.stringify(existing))
                            await sendmessage(m, {
                                title: `Queue saved under name "${name}"`,
                                succeed: true
                            })
                        } else if (answer != "yes") {
                            await removeReaction(m, msg, chosen);
                            return awaitReactions(msg, m, filter);
                        }
                    }
                    if (dispatcher != undefined) dispatcher.end();
                    await m.clearReactions();
                    await m.edit({ embed: exitCard });
                    await presence.leave();
                    exited = true;
                } else if (chosen === "❓") {
                    if (isTitleCard(m)) m = await m.edit({ embed: playingEmbed }).then(changed => { return changed })
                    else {
                        playingEmbed = copyEmbed(m.embeds[0])
                        m = await m.edit({ embed: titleCard }).then(changed => { return changed })
                    }
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                } else if (chosen === "❌") {
                    if (queue.length == 0) {
                        await sendmessage(m, {
                            title: "There is nothing in queue!",
                            succeed: false
                        })
                        await removeReaction(m, msg, chosen);
                        return awaitReactions(msg, m, filter);
                    }
                    var text = queue.map((e, i) => {
                        return `${i + 1}: ${e.status == "PLAYING" ? "(Now playing)" : ""} ${e.title}`
                    }).join("\n")
                    var pos = await reqmessage(m, {
                        title: "Which song would you like to remove?",
                        text: text,
                        check: ans => ans - 1 != NaN && ans - 1 >= 0 && ans < queue.length,
                        failed: "Invalid Position!",
                        callback: async ans => {
                            queue.splice(ans);
                            if (ans <= playing) playing--;
                            await sendmessage(m, {
                                title: "Song removed from queue!",
                                succeed: true
                            })
                        }
                    })
                    await removeReaction(m, msg, chosen);
                    return awaitReactions(msg, m, filter);
                }
            }).catch((err) => {
                exited = true;
            });
    }
    awaitReactions(message, m, filter)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: ["m"],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'music',
    description: 'Opens the AmonBot music panel',
    uses: {
        commands: ["music"],
        descriptions: ["Opens the reaction based music panel.\nSee the panel for more info"]
    }
};