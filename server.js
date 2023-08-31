// import express module
const express = require('express');
// import path module
const path = require('path');
// import api
const noteData = require('./db/db.json');
// import uuid function for generating unique ids
const uuid = require('./helpers/uuid.js');
// import fs module
const fs = require('fs');

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

// FIX TYPE ERROR AT LINE 41
// post request to post a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);

    // can't deconstruct undefined property
    const { noteTitle, noteText } = req.body;

    // if there is a note title and note text, as well as a uuid(), a new note will be saved
    if (noteTitle && noteText) {
        const newNote = {
            noteTitle,
            noteText,
            review_id: uuid(),
        };

        // appends new note to the db.json file 
        // if there is an error, an error is thrown
        // otherwise, 'New note added!' is logged to the console  
        fs.appendFile('./db/db.json', newNote, (err) => {
            if (err) {
                throw err;
            } else {
                console.log("New note added!");
            }
        })

        // variable for response to console
        const response = {
            status: 'Success!',
            body: newNote,
        };

        // logs 'Success!' to the console if the note is successfully saved
        console.log(response);
        res.status(201).json(response);

        // else, 'Error posting new note! is logged to the console
    } else {
        res.status(500).json('Error posting new note!');
    }
});

// console logs 'App is listening at http://localhost:3001'
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
