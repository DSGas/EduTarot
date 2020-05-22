const express = require('express'),
      router = express.Router();
      Tarot = require('../models/tarot'),
      middleware = require('../middleware');
      
router.get("/",middleware.isLoggedIn, function(req,res){
    Tarot.find({},function(error, allTarot){
        if(error){
            console.log("Error!");
        } else {
            res.render("tarots/index",{Tarot:allTarot});
        }
    })
});

router.post("/",middleware.isLoggedIn, function(req,res){
    let n_name = req.body.name;
    let n_image = req.body.image;
    let n_desc = req.body.desc;
    let n_author = {
        id: req.user._id,
        username: req.user.username
    };
    let n_card = {name:n_name,image:n_image,desc:n_desc,author: n_author};
    Tarot.create(n_card, function(error,newCard){
        if(error){
            console.log("error"); 
        } else {
            console.log("New card added.");
            console.log(newCard);
            res.redirect("/tarot");
        }
    });
});

router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("tarots/new");
});

router.get("/:id",middleware.isLoggedIn, function(req,res){
    Tarot.findById(req.params.id).populate('comments').exec(function(error, idCard){
        if(error){
            console.log("Error");
        } else {
            res.render("tarots/show",{tarot:idCard});
        }
    });
});

router.get("/:id/edit", middleware.checkTarotOwnership, function(req,res){
    Tarot.findById(req.params.id, function(err, foundTarot){
        res.render("tarots/edit", {tarot: foundTarot});
    });
});

router.put("/:id", middleware.checkTarotOwnership, function(req,res){
    Tarot.findByIdAndUpdate(req.params.id, req.body.tarot, function(err, updatedTarot){
        if(err){
            res.redirect('/tarot');
        } else {
            res.redirect('/tarot/' + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkTarotOwnership, function(req,res){
    Tarot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/tarot'); 
        } else {
            res.redirect('/tarot');
        }
    });
})


module.exports = router;