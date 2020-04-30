const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tarotSchema = new mongoose.Schema({
            name: String,
            image: String,
            desc: String
        });

tarotSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Tarot', tarotSchema);