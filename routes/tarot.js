const express = require('express'),
      router = express.Router(),
      multer = require('multer'),
      path = require('path'),
      fs = require('fs'),
      Tarot = require('../models/tarot'),
      middleware = require('../middleware');

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const imageFilter = function(req, file, cb){
    var ext = path.extname(file.originalname);
    if(ext !== '.png' && ext !== '.gif' && ext !== '.jpg' && ext !== '.jpeg'){
        return cb(new Error('Only image is allowed'), false)
        }
        cb(null, true);
};

const upload = multer({storage: storage, fileFilter: imageFilter})
      
router.get("/",middleware.isLoggedIn, function(req,res){
    Tarot.find({},function(error, allTarot){
        if(error){
            console.log("Error!");
        } else {
            res.render("tarots/index",{Tarot:allTarot});
        }
    })
});

// Create new card
router.post("/",middleware.isLoggedIn, upload.single('image'), function(req,res){
    // if(req.file){
    //     console.log('Image uploaded');
    // } else {
    //     console.log('fail');
    // }
    let n_name = req.body.name;
    let n_image = req.file.filename;
    let n_desc = req.body.desc;
    let n_author = {
        id: req.user._id,
        username: req.user.username
    };
    let n_card = {name:n_name,image:n_image,desc:n_desc,author: n_author};
    console.log(n_card);
    Tarot.create(n_card, function(error,newCard){
        if(error){
            console.log(error); 
        } else {
            console.log("New card added.");
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

router.put("/:id", middleware.checkTarotOwnership, upload.single('image'), function(req,res){
    let n_name = req.body.name;
    let n_desc = req.body.desc;
    if(req.file){
        let n_image = req.file.filename;
        Tarot.findById(req.params.id, function(err, foundTarot){
            if(err){
                res.redirect('/tarot');
            } else {
                const imagePath = './public/uploads/' + foundTarot.image;
                fs.unlink(imagePath, function(err){
                    if(err){
                        console.log(err);
                        res.redirect('/tarot');
                    }
                })
            }
        })
        var n_card = {name:n_name,image:n_image,desc:n_desc};
    } else {
        var n_card = {name:n_name,desc:n_desc};
    }
    Tarot.findByIdAndUpdate(req.params.id, n_card, function(err, updatedTarot){
        if(err){
            res.redirect('/tarot');
        } else {
            res.redirect('/tarot/' + req.params.id);
        }
    });
});

router.delete("/:id", middleware.checkTarotOwnership, function(req,res){
    Tarot.findById(req.params.id, function(err, foundTarot){
        if(err){
            res.redirect('/tarot');
        } else {
            const imagePath = './public/uploads/' + foundTarot.image;
            fs.unlink(imagePath, function(err){
                if(err){
                    console.log(err);
                    res.redirect('/tarot');
                }
            })
        }
    })
    Tarot.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/tarot'); 
        } else {
            res.redirect('/tarot');
        }
    });
})


module.exports = router;