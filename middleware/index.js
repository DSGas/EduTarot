const Tarot = require('../models/tarot');
const Comment = require('../models/comment');

let middlewareObj = {};

middlewareObj.checkTarotOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Tarot.findById(req.params.id, function(err, foundTarot){
            if(err){
                res.redirect("back");
            } else {
                if(foundTarot.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    res.redirect('back');
                }
            }
        });
    } else {
        res.redirect('back');
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'You need to login first');
    res.redirect('/login');
}

module.exports = middlewareObj;
