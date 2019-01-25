var fs = require('fs');
var Crawler = require("crawler");
var mongoose = require('mongoose');
var Movie = require('./movie.js');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/imdbcrawler', {});

var db = mongoose.connection;

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
db.once('open', function callback() {
    console.log("=================================\n\tDataBase is connecting\n\tStart Crawling\n=================================");
    //c.queue('https://www.imdb.com/title/tt1229340/');
    var root_url = require('./urls.json');
    var window = root_url.splice(234691, 100000);
    c.queue(window);
});

var errors =[];

var c = new Crawler({
    maxConnections: 10,
    callback: function (error, res, done) {
        if (error) {
            errors.push(res.request.uri.href);
            console.log("[ -- Error -- ] => " + res.request.uri.href + "\n");
        } else {
            var $ = res.$;
            var tmp = new Movie();
            tmp.link = res.request.uri.href;
            tmp.title = $('.heroic-overview .title_block .title_bar_wrapper .title_wrapper h1').text().replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
            tmp.year = $('#titleYear').text().trim();
            tmp.length = $('time').eq(0).text().replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
            tmp.category = $('.subtext a').eq(0).text().replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
            tmp.summery = $('.summary_text').text().replace(/(\r\n\t|\n|\r\t)/gm, "").trim();
            tmp.director = $('.credit_summary_item').eq(0).children('a').text();
            tmp.writers = $('.credit_summary_item').eq(1).children('a').text();
            tmp.rating = $('[itemprop="ratingValue"]').text();
            tmp.lang = $('#titleDetails .txt-block').eq(2).children('a').text()
            tmp.save((err, room) => {
                console.log("[ -- Done -- ] => " + tmp.link + "\n");
            });
        }
        done();
    }
});
c.on('drain', function () {
    console.log("\n*******************************\n\tEnded\n*******************************");
    fs.writeFile("./error.json",JSON.stringify(errors));
    mongoose.connection.close();
});