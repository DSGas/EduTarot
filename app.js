const   express = require("express"),
        bodyParser = require("body-parser"),
        mongoose = require("mongoose"),
        passport = require('passport'),
        passportLocal = require('passport-local'),
        passportLocalMongoose = require('passport-local-mongoose'),
        User = require('./models/user'),
        Tarot = require('./models/tarot'),
        tarotRoutes = require('./routes/tarot'),
        indexRoutes = require('./routes/index');;

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

app.use('/',indexRoutes);
app.use('/tarot',tarotRoutes);

app.listen(3000,function(req,res){
    console.log('EduTarot has started!');
});

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