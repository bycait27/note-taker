// import express module
const express = require('express');
// import path module
const path = require('path');

// declare app variable
const app = express();
// declare PORT variable
const PORT = 3001;

// invoke app.use() and serve static files from the public folder
app.use(express.static('public'));

// create a route that will serve the index.html file to user
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')) // send file to browser
});

// create a route that will serve the notes.html file to the user when clicking 'Get Started'
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
