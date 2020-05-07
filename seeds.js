const mongoose = require('mongoose');
const Tarot = require('./models/tarot');
const Comment = require('./models/comment');

const data = [
    {
        name:"3 of swords" ,
        image:"https://i.pinimg.com/564x/c7/c7/55/c7c755588cc9cea0ed125caabd12d7cf.jpg",
        desc:"ได้ 3 แต้ม"
    },
    {   name:"The temperance" ,
        image:"https://i.pinimg.com/564x/66/23/b8/6623b83603dc5298a5a5991c1e5ac3fb.jpg",
        desc:"ชานมไข่มุก 1 แก้ว"
    },
    {   name:"The justice" ,
        image:"https://i.pinimg.com/564x/74/3b/86/743b864115f766234370a56fc35f81aa.jpg",
        desc:"ครั้งหน้าเอาใหม่นะ"
    }
]

function seedDB(){
    Tarot.remove({}, function(err){
        if(err) {
            console.log('Remove database error');
        }
        console.log('Drop database success');
        data.forEach(function(seed){
            Tarot.create(seed, function(err, tarot){
                if(err){
                    console.log(err);
                } else {
                    console.log('Added a tarot');
                    Comment.create(
                        {
                            text: 'I want this card so bad.',
                            username: 'dsgas'
                        }, function(err, comment){
                            if(err) {
                                console.log(err);
                            } else {
                                tarot.comments.push(comment);
                                tarot.save();
                                console.log('Comment added');
                            }
                        });
                }
            });
        });
    });
}

module.exports = seedDB;