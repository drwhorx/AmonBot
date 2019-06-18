exports.run = async (bot, message, args, level) => {
    const Discord = require('discord.js');
    message.channel.send({
        embed: new Discord.RichEmbed().setColor("#ff9900").setTitle("💭 Calculating: This will take a few minutes, I'll ping you when I'm ready!")
    })
    const TBA = require('tba-api-storm');
    let req = new TBA("wFLfqneHnQeMApDRSJnAvtS1egVMBQzXxn2E6vGW0DuGy3HhRYztR8tGJvbdBX0G");
    var query = args[0]
    var config = {
        "Ranking Score2018": {
            "importance": 1.0
        },
        "Ranking Score2017": {
            "importance": 0.5
        },
        "Ownership2018": {
            "importance": 0.7
        },
        "Match Points2017": {
            "importance": 0.35
        },
        "Rotor2017": {
            "importance": 0.3
        },
        "Park/Climb Points2018": {
            "importance": 0.2
        },
        "Num Events 2017": {
            "importance": 1.3
        },
        "Num Events 2018": {
            "importance": 1.3
        }
    }
    var keys
    var search2017 = ["Ranking Score", "Match Points", "Rotor"]
    var search2018 = ["Ranking Score", "Ownership", "Park/Climb Points"]
    var keys = await new Promise(resolve => {
        req.getDistrictTeamsKeys(query, query.substring(0, 4)).then(temp => {
            resolve(temp)
        }).catch(async err => {
            resolve(await req.getEventTeamsKeys(query))
        })
    })
    var scores = {}
    for (let i = 0; i < keys.length; i++) {
        console.log("Team " + keys[i].slice(3) + "...")
        var teamOut = {
            "Ranking Score": 0,
            "Match Points": 0,
            "Rotor": 0,
            "Ownership": 0,
            "Park/Climb Points": 0,
            "Num Events 2017": 0,
            "Num Events 2018": 0
        }
        var evts2017 = await req.getTeamEventListKeys(keys[i].slice(3), "2017")
        for (let a = 0; a < evts2017.length; a++) {
            var rankings = await getEventRankingsByTeam(evts2017[a])
            if (!rankings || !rankings[keys[i]]) {
                evts2017.splice(a, 1)
            }
        }
        var evts2018 = await req.getTeamEventListKeys(keys[i].slice(3), "2018")
        for (let a = 0; a < evts2018.length; a++) {
            var rankings = await getEventRankingsByTeam(evts2018[a])
            if (!rankings || !rankings[keys[i]]) {
                evts2018.splice(a, 1)
            }
        }
        teamOut["Num Events 2018"] = evts2018.length
        teamOut["Num Events 2017"] = evts2017.length
        for (a = 0; a < evts2017.length; a++) {
            var info = await req.getEvent(evts2017[a])
            var sorted = await getEventRanksSortedTeams(evts2017[a])
            var vals = await getEventRanksSortedVals(evts2017[a])
            var multi = 1
            var multiArr = [1, 1, 1.2, 1.4, 1.5, 1.3, 1]
            if (info.event_type == -1) {
                multi = 1
            } else if (info.event_type == 99) {
                multi = 0.7
            } else if (info.event_type == 100) {
                multi = 0.7
            } else {
                multi = multiArr[info.event_type]
            }
            for (b = 0; b < search2017.length; b++) {
                var max = Math.max(...vals[search2017[b]])
                var min = Math.min(...vals[search2017[b]])
                var index = sorted[search2017[b]].indexOf(keys[i])
                var scaled = (vals[search2017[b]][index] - min) / (max - min)
                var conf = teamOut["Num Events 2017"] * config["Num Events 2017"].importance
                var val = multi * scaled * config[search2017[b] + "2017"].importance * conf
                if (search2017[b] == "Ranking Score") {
                    teamOut[search2017[b]] += val / (evts2017.length + evts2018.length)
                } else {
                    teamOut[search2017[b]] += val / evts2017.length
                }
            }
        }
        for (a = 0; a < evts2018.length; a++) {
            var info = await req.getEvent(evts2018[a])
            var sorted = await getEventRanksSortedTeams(evts2018[a])
            var vals = await getEventRanksSortedVals(evts2018[a])
            var multi = 1
            var multiArr = [1, 1, 1.2, 1.4, 1.5, 1.3, 1]
            if (info.event_type == -1) {
                multi = 1
            } else if (info.event_type == 99) {
                multi = 0.7
            } else if (info.event_type == 100) {
                multi = 0.7
            } else {
                multi = multiArr[info.event_type]
            }
            for (b = 0; b < search2018.length; b++) {
                var max = Math.max(...vals[search2018[b]])
                var min = Math.min(...vals[search2018[b]])
                var index = sorted[search2018[b]].indexOf(keys[i])
                var scaled = (vals[search2018[b]][index] - min) / (max - min)
                var conf = teamOut["Num Events 2018"] * config["Num Events 2018"].importance
                var val = multi * scaled * config[search2018[b] + "2018"].importance * conf
                if (search2018[b] == "Ranking Score") {
                    teamOut[search2018[b]] += val / (evts2017.length + evts2018.length)
                } else {
                    teamOut[search2018[b]] += val / evts2018.length
                }
            }
        }
        scores[keys[i]] = Object.values(teamOut).splice(0, 5).reduce((a, b) => a + b)
    }
    console.log("Wrapping up...")
    var vals = Object.values(scores)
    var keyCopy = keys.slice(0)
    var copy = vals.slice(0).sort(function (a, b) {
        return b - a
    })
    var sorted = {}
    copy.forEach(function (element) {
        var index = vals.indexOf(element)
        sorted[keyCopy[index]] = element
        vals.splice(index, 1)
        keyCopy.splice(index, 1)
    })
    var output = []
    var keys = Object.keys(sorted)
    for (let i = 0; i < keys.length; i++) {
        output.push((i + 1) + ". **FRC " + keys[i].slice(3) + ":** " + (Math.floor(copy[i] * 1000) / 1000) + "\n")
        console.log(keys[i].slice(3))
    }
    var embed = new Discord.RichEmbed()
    var name
    if (!(await req.getEvent(query))) {
        name = query.slice(4).toUpperCase() + " District " + query.substring(0, 4)
    } else {
        name = (await req.getEvent(query)).name
    }
    var out = ""
    embed.setColor("#ff9900")
    message.channel.send("<@" + message.author.id + ">")
    for (let i = 0; i < output.length; i++) {
        if (out.length >= 700) {
            embed.addField("FFAI for " + name, out)
            message.channel.send({
                embed: embed
            })
            embed = new Discord.RichEmbed()
            embed.setColor("#ff9900")
            out = output[i]
        } else {
            out += output[i]
        }
    }
    if (out !== "") {
        embed.addField("FFAI for " + name, out)
        message.channel.send({
            embed: embed
        })
    }
    console.log("Finished!")
    async function getEventRanksSortedTeams(eventKey) {
        function search() {
            return new Promise(async resolve => {
                var out = {}
                var ranks = await req.getEventRankings(eventKey)
                var byTeam = await getEventRankingsByTeam(eventKey)
                for (i = 0; i < ranks.sort_order_info.length; i++) {
                    var title = ranks.sort_order_info[i].name
                    var arr = []
                    var teams = []
                    for (let b = 0; b < ranks.rankings.length; b++) {
                        var key = ranks.rankings[b].team_key
                        arr.push(byTeam[key][title])
                        teams.push(key)
                    }
                    var copy = arr.slice(0)
                    copy.sort(function (a, b) {
                        return b - a;
                    });
                    var sortedTeams = []
                    for (let b = 0; b < copy.length; b++) {
                        var index = arr.indexOf(copy[b])
                        sortedTeams.push(teams[index])
                        teams.splice(index, 1)
                        arr.splice(index, 1)
                    }
                    out[title] = sortedTeams
                }
                resolve(out)
            });
        };
        var x = await search();
        return x
    }
    async function getEventRanksSortedVals(eventKey) {
        function search() {
            return new Promise(async resolve => {
                var out = {}
                var ranks = await req.getEventRankings(eventKey)
                var byTeam = await getEventRankingsByTeam(eventKey)
                for (i = 0; i < ranks.sort_order_info.length; i++) {
                    var title = ranks.sort_order_info[i].name
                    var arr = []
                    var teams = []
                    for (let b = 0; b < ranks.rankings.length; b++) {
                        var key = ranks.rankings[b].team_key
                        arr.push(byTeam[key][title])
                        teams.push(key)
                    }
                    var copy = arr.slice(0)
                    copy.sort(function (a, b) {
                        return b - a;
                    });
                    out[title] = copy
                }
                resolve(out)
            });
        };
        var x = await search();
        return x
    }
    async function getEventRankingsByTeam(eventKey) {
        function search() {
            return new Promise(resolve => {
                req.getEventRankings(eventKey).then(rankings => {
                    if (!rankings) {
                        resolve("NOPE")
                        return
                    } else if (!rankings.rankings) {
                        resolve("NOPE")
                        return
                    }
                    var titles = []
                    var output = {}
                    rankings.sort_order_info.forEach(function (element) {
                        titles.push(element.name)
                    });
                    rankings.rankings.forEach(function (data) {
                        output[data.team_key] = {}
                        data.sort_orders.forEach(function (element, index) {
                            if (index < titles.length) {
                                output[data.team_key][titles[index]] = element
                            }
                        });
                    })
                    resolve(output)
                }).catch(err => {
                    resolve(undefined)
                })
            });
        };
        var x = await search();
        return x
    }
};
exports.conf = {
    enabled: false,
    guildOnly: false,
    aliases: [],
    permLevel: "USER",
    botPerms: []
};

exports.help = {
    name: 'ffai',
    description: 'Fantasy FIRST AI',
    uses: {
        commands: [],
        descriptions: []
    }
};