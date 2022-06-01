const http = require('http');
const express = require('express');

const app = express();
const port = 3000;

app.use((req, res, next) => {
    console.log("In the first middleware");
    next();
})

app.use((req,res,next) => { 
    console.log("Joined the second middleware!");
    res.send("<h1>")
 })

const server = http.createServer(app)
server.listen(port);