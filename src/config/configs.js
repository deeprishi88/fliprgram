require("dotenv").config();

const config = {
    EMAIL: process.env.EMAIL,
    SECRET: process.env.EMAILPASSWORD,
    EMAILSERVICE: process.env.EMAILSERVICE,

    JWTSECRET: process.env.JWTSECRET || "secret",
    JWTEXP: "5d",
}

module.exports = config;