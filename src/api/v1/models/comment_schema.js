const mongoose = require('mongoose');

const comment_model = mongoose.model('comment_model', {
    text : {
        type : String,
        required : true
    },
    creater_id : {
        type : [mongoose.Schema.Types.ObjectId],
        required : true,
        ref : 'User'
    },
    post_id : {
        type : [mongoose.Schema.Types.ObjectId],
        required : true,
        ref : 'User_posts'
    },
    created_at : {
        type: Date
    },
    replies : {
        type : [mongoose.Schema.Types.ObjectId],
        ref: 'comment_model'
    }
});

module.exports = comment_model;