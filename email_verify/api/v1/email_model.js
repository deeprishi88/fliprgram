const mongoose = require("mongoose");

const emailSchema = new mongoose.Schema(
    {
        verificationCode: {
            type: String,
            unique: true,
            required: true,
        },
        eventName: {
            type: String,
            enum: ["verificationemail", "forgotpasswordemail"],
            required: true,
        },
        associatedUser: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "user",
            required: true,
        },
        failed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
);

module.exports.Email = mongoose.model("email", emailSchema);