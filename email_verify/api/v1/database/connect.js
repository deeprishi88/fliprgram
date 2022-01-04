const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/instaclone', {
    useNewUrlParser: true,
    //useUnifiedTopology: true
}, function(err){
    if(err) console.log(err);
    console.log("database is connected");
});