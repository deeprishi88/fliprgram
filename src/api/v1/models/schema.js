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
    }
});

module.exports = User;