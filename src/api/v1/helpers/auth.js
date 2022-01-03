const {JWTSECRET, JWTEXP} = require('../../../config/configs');
const User = require('../models/schema');
const jwt = require('jsonwebtoken');

exports.newToken = (user) => {
    return jwt.sign(
        { id: user.id, varifiedUser: user.verifiedUser },
        JWTSECRET,
        {
            expiresIn: JWTEXP,
        },
    );
};

exports.verifyToken = (token) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, JWTSECRET, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });
