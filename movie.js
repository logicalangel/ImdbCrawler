var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MovieSchema = new Schema({
    link: {
        type: String,
        unique: true
    },
    title: String,
    year: String,
    length: String,
    rating: String,
    summery: String,
    director: String,
    writers: String,
    category: String,
    lang: String
});

module.exports = mongoose.model('Movie', MovieSchema, 'Movie');