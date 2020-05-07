const   mongoose = require('mongoose'),
        passportLocalMongoose = require('passport-local-mongoose');

let tarotSchema = new mongoose.Schema({
            name: String,
            image: String,
            desc: String,
            comments: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Comment'
                }
            ]
        });

tarotSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Tarot', tarotSchema);