const   express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        User = require('./models/user'),
        Tarot = require('./models/tarot');

const   app = express();

mongoose.connect('mongodb://localhost:27017/edutarot', {useNewUrlParser: true});
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(require('express-session')({
    secret: 'CSS227',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});

passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Tarot.create(
//     {
//         name: "The temperance",
//         image: "https://i.pinimg.com/564x/66/23/b8/6623b83603dc5298a5a5991c1e5ac3fb.jpg",
//         desc: "ชานมไข่มุก 1 แก้ว"
//     }, function(error, tarot){
//         if(error){
//             console.log("Error!");
//         } else {
//             console.log("Added");
//             console.log(tarot);
//         }
//     });

// Tarot = [
//     {   name:"3 of swords" ,
//         image:"https://i.pinimg.com/564x/c7/c7/55/c7c755588cc9cea0ed125caabd12d7cf.jpg",
//         desc:"ได้ 3 แต้ม"},
//     {   name:"The temperance" ,
//         image:"https://i.pinimg.com/564x/66/23/b8/6623b83603dc5298a5a5991c1e5ac3fb.jpg",
//         desc:"ชานมไข่มุก 1 แก้ว"},
//     {   name:"The justice" ,
//         image:"https://i.pinimg.com/564x/74/3b/86/743b864115f766234370a56fc35f81aa.jpg",
//         desc:"ครั้งหน้าเอาใหม่นะ"},
//     {   name:"The fool" ,
//         image:"https://i.pinimg.com/564x/46/ba/fb/46bafb6edbb3d7dabc1ce611f1c234fb.jpg",
//         desc:"Secret"},
//     {   name:"The magician" ,
//         image:"https://i.pinimg.com/564x/c1/16/3f/c1163fa630fc75a7dd8973a7c15726ef.jpg",
//         desc:"Copy รางวัลเพื่อนได้ 1 ครั้ง"},
//     {   name:"The high priestess" ,
//         image:"https://i.pinimg.com/564x/6f/35/77/6f35779ea790db119de4111a4d4db8c5.jpg",
//         desc:"+ เกรด 1 ประจุ"},
//     {   name:"The empress" ,
//         image:"https://i.pinimg.com/564x/f3/d6/6f/f3d66f727ab00a6d72d9c8be4f0dd47f.jpg",
//         desc:"ปรับคะแนนเป็น mean"},
//     {   name:"The hierophant" ,
//         image:"https://i.pinimg.com/564x/3f/8b/fd/3f8bfd7540a6d2eb0c737d61600997b7.jpg",
//         desc:"ไม่ต้องส่งการบ้าน 1 ครั้ง"},    
//     {   name:"The chariot" ,
//         image:"https://i.pinimg.com/564x/6e/bc/25/6ebc25a4d9ec84c877f2337415520acf.jpg",
//         desc:"หลับในห้องได้เสรี"},
//     {   name:"The judgement" ,
//         image:"https://i.pinimg.com/564x/d3/57/b8/d357b83b44750007929b383bb136d5ef.jpg",
//         desc:"Buffet หมูกระทะ 1 มื้อ"}        
// ];
app.get('/',function(req,res){
    res.render('landing');
    console.log('Welcome to the club');
});

app.get("/tarot",isLoggedIn, function(req,res){
    Tarot.find({},function(error, allTarot){
        if(error){
            console.log("Error!");
        } else {
            res.render("tarotlist",{Tarot:allTarot});
        }
    })
});

app.post("/tarot",isLoggedIn, function(req,res){
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

app.get("/tarot/new",isLoggedIn, function(req,res){
    res.render("addnewtarot");
});

app.get("/tarot/:id",isLoggedIn, function(req,res){
    Tarot.findById(req.params.id, function(error, idCard){
        if(error){
            console.log("Error");
        } else {
            res.render("showdetails",{tarot:idCard});
        }
    });
});

// -------Authen routes-----------

app.get('/login', function(req,res){
    res.render('login');
});

app.post('/login', passport.authenticate('local',{
    successRedirect: '/tarot',
    failureRedirect: 'login'
}),function(req, res){
});

app.get('/logout', function(req,res){
    req.logout();
    res.redirect('/');
});

app.get('/signup', function(req,res){
    res.render('signup');
});

app.post('/signup', function(req,res){
    User.register(new User({username: req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('signup');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/tarot');
        });
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

app.listen(3000,function(req,res){
    console.log('EduTarot has started!');
});
