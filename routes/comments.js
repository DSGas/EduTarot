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
            res.redirect('/tarot');
        } else {
            Comment.create(req.body.comment, function(err,comment){
                if(err){
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    tarot.comments.push(comment);
                    tarot.save();
                    res.redirect('/tarot/' + tarot._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkTarotOwnership, function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect('back');
        } else {
            res.render("comment/edit", {tarot_id: req.params.id, comment: foundComment});
        }
    });
});

router.put("/:comment_id", middleware.checkTarotOwnership, function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect('back');
        } else {
            res.redirect('/tarot/' + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkTarotOwnership, function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect('back'); 
        } else {
            res.redirect('/tarot/' + req.params.id);
        }
    });
});

module.exports = router;