const express = require('express'),
      router = express.Router();
      Tarot = require('../models/tarot'),
      middleware = require('../middleware');
      
router.get("/",middleware.isLoggedIn, function(req,res){
    Tarot.find({},function(error, allTarot){
        if(error){
            console.log("Error!");
        } else {
            res.render("tarotlist",{Tarot:allTarot});
        }
    })
});

router.post("/",middleware.isLoggedIn, function(req,res){
    let n_name = req.body.name;
    let n_image = req.body.image;
    let n_desc = req.body.desc;
    let n_card = {name:n_name,image:n_image,desc:n_desc};
    Tarot.create(n_card, function(error,newCard){
        if(error){
            console.log("error"); 
        } else {
            console.log("New card added.");
            res.redirect("/tarot");
        }
    });
});

router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("addnewtarot");
});

router.get("/:id",middleware.isLoggedIn, function(req,res){
    Tarot.findById(req.params.id, function(error, idCard){
        if(error){
            console.log("Error");
        } else {
            res.render("showdetails",{tarot:idCard});
        }
    });
});


module.exports = router;