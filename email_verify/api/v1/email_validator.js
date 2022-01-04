const validator = require("validator");
const { isValidObjectId } = require("mongoose");
const { validate } = require("uuid");

// validates email is correct or not
 exports.emailValidator = (email) => {
    try {
        return validator.isEmail(email);
    } catch (e) {
        return false;
    }
};
// validates id is correct or not
exports.IdValidator = (id) => {
    try {
        return isValidObjectId(id) && validator.isMongoId(id);
    } catch (e) {
        return false;
    }
};

// check for verification code
exports.verificationCodeValidator = (code) => {
    if (validate(code)) return true;
    return false;
};

// reason for sending email.
exports.eventValidator = (eventName) => {
    const reason_for_email = ["verificationemail", "forgotpasswordemail"];
    return reason_for_email.includes(eventName);
};
