exports.run = async (bot, message, args, level) => {
    const Discord = require('discord.js');
    const TBA = require('tba-api-storm');
    let req = new TBA(bot.config.tba_key);
    var curYear = new Date().getFullYear();
    var query = args[0];
    var teamNumber = args[1];
    if (query == "teaminfo") {
        var teaminfo = new Discord.RichEmbed();
        req.getTeam(teamNumber).then(d => {
            teaminfo.setAuthor('FRC Team ' + teamNumber, 'http://i.imgur.com/V8nrobr.png', 'https://www.thebluealliance.com/team/' + teamNumber)
                .setColor("#0e4dff")
                .setThumbnail('https://frcavatars.herokuapp.com/get_image?team=' + teamNumber)
                .addField('Name', d.nickname, true)
                .addField('Rookie Year', d.rookie_year, true)
                .addField('Location', `${d.city}, ${d.state_prov}, ${d.country}`, true)
                .addField('Website', d.website, true);
            message.channel.send({
                embed: teaminfo
            });
        }).catch(e => {
            console.log(e);
            message.channel.send(bot.alert('Team does not exist'));
        });
    } else if (query == "robots") {
        var robots = new Discord.RichEmbed();
        req.getTeamRobots(teamNumber).then(d => {
            robots.setAuthor('Robot Names for FRC Team ' + teamNumber, 'http://i.imgur.com/V8nrobr.png', 'https://www.thebluealliance.com/team/' + teamNumber)
                .setColor("#0e4dff");
            for (let i in d) {
                robots.addField(d[i].year, d[i].robot_name);
            }
            message.channel.send({
                embed: robots
            });
        }).catch(e => {
            console.log(e.message);
            message.reply('an error has occurred');
        });
    } else if (query == "events") {
        var evts = new Discord.RichEmbed();
        let year = args[2];
        if (year === undefined) {
            year = curYear;
        }
        req.getTeamEventList(teamNumber, year).then(d => {
            evts.setAuthor('Events for FRC Team ' + teamNumber + ' in ' + year, 'http://i.imgur.com/V8nrobr.png', 'https://www.thebluealliance.com/team/' + teamNumber)
                .setColor("#0e4dff");
            for (var i = 0; i < d.length; i++) {
                var startDate = new Date(d[i].start_date);
                var endDate = new Date(d[i].end_date);
                evts.addField(`${d[i].year} ${d[i].name}`, `${d[i].location_name}, ${d[i].city}, ${d[i].state_prov}, ${d[i].country}\n${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`);
            }
            message.channel.send({
                embed: evts
            });
        }).catch(e => {
            console.log(e.message);
            message.reply('an error has occurred');
        });
    }
};
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'tba',
    description: 'Accesses the Blue Alliance API',
    usage: 'tba <teaminfo/events/robots> <teamnumber> <year>',
    uses: {
        commands: [
            "tba teaminfo *team*",
            "tba events *team* *year*",
            "tba robots *team*"
        ],
        descriptions: [
            "Gives TBA info on a given FRC *team*",
            "Gives the events a *team* competed at in a given *year*. Default year is the current year",
            "Gives the robot names of a given FRC *team*"
        ]
    }
};