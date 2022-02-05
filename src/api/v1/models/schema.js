//const { triggerAsyncId } = require('async_hooks');
const mongoose = require('mongoose');

const User = mongoose.model('User', {
    username : {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    email : {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    hash : {
        type: String,
        unique: true,
        minlength: 8,
        trim: true,
        required: true
    },
    email_verified : {
        type: Boolean,
        default: false
    },
    created_at : {
        type: Date
    },
    updated_at : {
        type: Date
    },
    profile_pic : {
        type: String
    },
    profile_pic_id : {
        type: String
    },
    friends : {
        type: [String],
        default: []
    },
    sentrequests : {
        type: [String],
        default: []
    },
    receiverequests : {
        type: [String],
        default: []
    },
    blocklist : {
        type: String,
        default: []
    },
    post_id : {
        type: [mongoose.Schema.Types.ObjectId],
        default: [],
    },
    liked_posts : {
        type: [mongoose.Schema.Types.ObjectId],
        deafult: []
    },
    comments_made : {
        type: [mongoose.Schema.Types.ObjectId],
        ref : 'comment_model'
    },
    profileStatus:{
        type: String,
        enum: ["public", "private"],
        default: "public",
    },

    notification:{
        type: Boolean,
        default: false,
    },
});

module.exports = User;