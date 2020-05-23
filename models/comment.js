const   mongoose = require('mongoose');
        // passportLocalMongoose = require('passport-local-mongoose');

let commentSchema = new mongoose.Schema({
            text: String,
            author: {
                id: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                },
                username: String
            }
        });

// tarotSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('Comment', commentSchema);