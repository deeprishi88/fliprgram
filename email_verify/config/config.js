require("dotenv").config();

const config = {
    MODE: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 4000,
    EMAIL: process.env.EMAIL,
    SECRET: process.env.EMAILPASSWORD,
    EMAILSERVICE: process.env.EMAILSERVICE,

    JWTSECRET: process.env.JWTSECRET || "secret",
    JWTEXP: "5d",
    BASEURL: process.env.BASEURL || "http://localhost:3000",
};

module.exports = config;