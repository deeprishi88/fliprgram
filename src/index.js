const express = require('express');
const mongoose = require('mongoose');
const user_route = require('./api/v1/routes/route');
const friend_route = require('./api/v1/routes/friend_route');
const media_route = require('./api/v1/routes/media_route');
const posts_route = require('./api/v1/routes/posts_route');
const db = require('./api/v1/database/databases');
const app = express();
const { PORT } = require('./config/configs');

app.use(express.json());


app.use(user_route);

app.use(friend_route);

app.use(media_route);

app.use(posts_route);

app.listen(PORT, function(err){
    if (err) console.log(err.message);
    console.log("Server listening on PORT", PORT);
});