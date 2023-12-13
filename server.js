// import necessary modules
const express = require('express');
const path = require('path');
const noteData = require('./db/db.json');
const uuid = require('./helpers/uuid.js');
const fs = require('fs');

// declare app variable
const app = express();
// declare PORT variable
const PORT = process.env.PORT || 3001;

// invoke app.use() and serve static files from the public folder
app.use(express.static('public'));

// create a route that will serve the index.html file to user
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html')) // send file to browser
});

// create a route that will serve the notes.html file to the user when clicking 'Get Started'
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'))
});

// retrieve notes data
app.get('/api/notes', (req, res) => {
    // TODO: fix this code
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        const parsedData = JSON.parse(data);

        res.json(parsedData);
    });
});

// post request to post a new note
app.post('/api/notes', (req, res) => {
    console.info(`${req.method} request received to add a new note`);
    const newNote = {
        title: req.body.title,
        text: req.body.text,
        id: uuid(),
    };
    // appends new note to existing notes data
    noteData.push(newNote);
    fs.writeFileSync('./db/db.json', JSON.stringify(noteData));
    res.json(newNote);
    // variable for response to console
    const response = {
        status: 'Success!',
        body: newNote,
    };
    // logs 'Success!' to the console if the note is successfully saved
    console.log(response);
    res.status(201).json(response);
});

// console logs 'App is listening at http://localhost:3001'
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
});
