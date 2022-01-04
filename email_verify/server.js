const express = require('express');
const { PORT,MODE } = require('./config/config');
const db = require('./api/v1/database/connect');
const email_router = require('./api/v1/email_router');

const app = express();

app.use(express.json());

app.use("/", email_router);

app.get("/ping", (req, res) => {
    res.status(200).send("OK");
});

app.listen(PORT, function(err){
    if (err) console.log(err.message);
    console.log("Email Server listening on PORT", PORT);
});



