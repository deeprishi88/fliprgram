const express = require('express');
const app = express();
var PORT = 3000;

app.use(express.json());

app.get('/', (req,res) => {
    res.send('Hello')
});

app.listen(PORT, function(err){
    if (err) console.log(err.message);
    console.log("Server listening on PORT", PORT);
});