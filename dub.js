var mongoose = require('mongoose');
var Movie = require('./movie.js');
var fs = require('fs');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/imdbcrawler', {
    useNewUrlParser: true
});

var db = mongoose.connection;
var urls_old = require('./urls.json');
var urls = urls_old.splice(0, 70000);

db.on('error', function (err) {
    console.log('connection error:', err.message);
});
Movie.where('link').nin(urls).select("link").exec((err, movie_r) => {
    if (err) {
        console.log("Error => " + err.message);
    } else {
        fs.writeFile('missed.json', JSON.stringify(movie_r), () => {
            console.log('\t ' + movie_r.length);
            console.log("\t Done!")
        });
    }
});