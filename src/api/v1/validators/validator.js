const validator = require('validator');

exports.tokenValidator = (token) => {
    try {
        return validator.isJWT(token);
    } catch (e) {
        return false;
    }
};