// import express module
const express = require('express');
// import path module
const path = require('path');
// import api
const noteData = require('./db/db.json');
// import uuid function for generating unique ids
const uuid = require('./helpers/uuid.js');

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

// retrieve notes data
app.get('/api/notes', (req, res) => {
    res.json(noteData)
});

// FIX TYPE ERROR AT LINE 40
// post request to post a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);
    // const noteTitle = req.body;
    // const noteText = req.body;

    const { noteTitle, noteText } = req.body;

    if (noteTitle && noteText) {
        const newNote = {
            noteTitle,
            noteText,
            review_id: uuid(),
        };

        const response = {
            status: 'Success!',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response);
    } else {
        res.status(500).json('Error posting new note!');
    }
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
