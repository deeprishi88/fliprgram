const mongoose = require('mongoose');

const User_posts = mongoose.model('User_posts', {
    user_id : {
        type : mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    post_image : {
        type: String,
    },
    post_image_id : {
        type : String,
    },
    created_at : {
        type: Date
    },
    likes : {
        type : Number,
        default : 0
    },
    unlikes : {
        type : Number,
        default : 0
    },
    users_who_liked : {
        type : [mongoose.Schema.Types.ObjectId],
        default : [],
        ref : 'User'
    },
    tagged_users : {
        type : [String],
        default : [],
        ref : 'User'
    },
    comments : {
        type : [mongoose.Schema.Types.ObjectId],
        default : [],
        ref : 'comment_model'
    }
},
);

module.exports = User_posts;