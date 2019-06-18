const fs = require("fs");
const execa = require('execa');
fs.writeFileSync("./config.js", fs.readFileSync("./config_example.txt"))
fs.writeFileSync("./afk.json", "[]")
fs.writeFileSync("./mixtape.json", "{}")
console.log("Run \"npm install\" to finish the install process.")