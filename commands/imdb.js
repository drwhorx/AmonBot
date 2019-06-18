exports.run = (bot, message, args, level) => {
    const Discord = require('discord.js');
    const fetch = require('node-fetch');
    const comm = args[0]
    const query = args.slice(1).join('%20');
    if (comm == "tv") {
        var url = "http://www.omdbapi.com/?apikey=f335485e&type=series&t=" + query
    } else if (comm == "movie") {
        var url = "http://www.omdbapi.com/?apikey=f335485e&t=" + query
    } else {
        return message.channel.send({
            embed: new Discord.RichEmbed().setTitle("Please specify either a movie or a tv show! \(!m or !tv\)").setColor("#ff0000")
        });
    }
    fetch(url)
        .then(res => res.json())
        .then((out) => {
            if (comm == "tv") {
                var output = new Discord.RichEmbed();
                output.setTitle("IMDb says...");
                var fields = [];
                fields.push(out.Released);
                fields.push(out.Genre);
                fields.push(out.Runtime + "utes per episode, " + out.totalSeasons + " seasons");
                fields.push("*" + out.Plot + "*");
                fields.push("Writer(s): " + out.Writer);
                fields.push("Cast: " + out.Actors);
                fields.push("IMDb score: " + out.imdbRating + "/10");
                if (out.Metascore !== "N/A") {
                    fields.push("Metascore: " + out.Metascore);
                }
                var found = out.Ratings.find(function (element){
                    return element.Source === "Rotten Tomatoes"
                })
                if (found) {
                    fields.push("Rotten Tomatoes: " + found.Value);
                }
                fields.push(out.Awards);
                fields.push("See more at https://www.imdb.com/title/" + out.imdbID);
                output.addField(out.Title + " (" + out.Year + ")", fields.join("\n"));
                output.setThumbnail(out.Poster);
                output.setColor("#FFB600");
                message.channel.send({embed: output});
            } else if (comm == "movie") {
                var output = new Discord.RichEmbed();
                output.setTitle("IMDb says...");
                var fields = [];
                fields.push(out.Released);
                fields.push(out.Genre);
                fields.push('*"' + out.Plot + '"*');
                fields.push("Director(s): " + out.Director);
                fields.push("Writer(s): " + out.Writer);
                fields.push("Cast: " + out.Actors);
                fields.push("IMDb score: " + out.imdbRating + "/10");
                if (out.Metascore !== "N/A") {
                    fields.push("Metascore: " + out.Metascore);
                }
                var found = out.Ratings.find(function (element){
                    return element.Source === "Rotten Tomatoes"
                })
                if (found) {
                    fields.push("Rotten Tomatoes: " + found.Value);
                }
                fields.push(out.Awards);
                fields.push("See more at https://www.imdb.com/title/" + out.imdbID);
                output.addField(out.Title + " (" + out.Year + ")", fields.join("\n"));
                output.setThumbnail(out.Poster)
                output.setColor("#FFB600");
                message.channel.send({embed: output});
            }
        })
        .catch(err => {
            throw err
        });
};

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'imdb',
    description: 'Searches IMDb for either a movie or a tv show',
    uses: {
        commands: ["imdb movie *title*", "imdb tv *title*"],
        descriptions: ["Search IMDb for a movie", "Search IMDb for a TV Show"]
    }
};