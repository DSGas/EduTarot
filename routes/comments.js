const   express = require('express'),
        router = express.Router({mergeParams: true}),
        Tarot = require('../models/tarot'),
        Comment = require('../models/comment'),
        middleware = require('../middleware');

router.get('/new', middleware.isLoggedIn, function(req,res){
    // console.log(req.params.id);
    Tarot.findById(req.params.id, function(err, tarot){
        if(err){
            console.log(err);
        } else {
            res.render('comment/new',{tarot: tarot});
        }
    });
});

router.post('/', middleware.isLoggedIn, function(req,res){
    Tarot.findById(req.params.id, function(err, tarot){
        if(err){
            console.log(err);
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    tarot.comments.push(comment);
                    tarot.save();
                    res.redirect('/tarot/' + tarot._id);
                }
            });
        }
    });
});

module.exports = router;