const { validate } = require("uuid");
const validator = require("validator");
/**
 * Validates email is correct or not
 * @param {string} email
 * @returns boolean
 */
exports.emailValidator = (email) => {
    try {
        return validator.isEmail(email);
    } catch (e) {
        return false;
    }
};

/**
 * checks whether password is week or strong
 * @param {string} password
 * @returns boolean
 */
exports.passwordValidator = (password) => {
    try {
        // return validator.isStrongPassword(password);
        if (password.length > 4) return true;
        return false;
    } catch (e) {
        return false;
    }
};

/**
 * checks whether username is strong or not
 * @param {string} username
 * @returns boolean
 */
exports.usernameValidator = (username) => {
    try {
        if (username.length > 4) return true;
        return false;
    } catch (e) {
        return false;
    }
};

/**
 *  checks whether JWT Token is valid or not
 * @param {JWT token} token
 * @returns boolean
 */
exports.tokenValidator = (token) => {
    try {
        return validator.isJWT(token);
    } catch (e) {
        return false;
    }
};

/**
 * checks whether verification code is valid for application or not
 * @param {string} code
 * @returns boolean
 */
exports.verificationCodeValidator = (code) => {
    if (validate(code)) return true;
    return false;
};