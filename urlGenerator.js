var fs = require('fs');

var urls = [];

for (let i = 0; i < 1000000; i++) {
    urls.push("https://www.imdb.com/title/tt" + i.toString().padStart(7, '0') + "/");
}

fs.writeFileSync("urls.json", JSON.stringify(urls));