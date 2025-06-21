// import necessary modules
const express = require("express");
const path = require("path");
const noteData = require("./db/db.json");
const uuid = require("./helpers/uuid.js");
const fs = require("fs");

// declare app and PORT variables
const app = express();
const PORT = process.env.PORT || 3001;

// middleware for parsing JSON and urlencoded form data
app.use(express.json());

// invoke app.use() and serve static files from the public folder
app.use(express.static("public"));

// create a route that will serve the index.html file to user
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html")); // send file to browser
});

// create a route that will serve the notes.html file to the user when clicking 'Get Started'
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"));
});

// retrieve notes data
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const parsedData = JSON.parse(data);

    res.json(parsedData);
  });
});

// post request to post a new note
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a new note`);
  const newNote = {
    title: req.body.title,
    text: req.body.text,
    id: uuid(),
  };

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const parsedData = JSON.parse(data);
    parsedData.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(parsedData), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const response = {
        status: "Success!",
        body: newNote,
      };

      console.log(response);
      res.status(201).json(response);
    });
  });
});

// delete request to delete a note
app.delete("/api/notes/:id", (req, res) => {
  console.info(`${req.method} request received to delete a note`);

  const noteId = req.params.id;
  console.log("noteId:", noteId);

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const parsedData = JSON.parse(data);
    const newData = parsedData.filter((note) => note.id !== noteId);

    fs.writeFile("./db/db.json", JSON.stringify(newData), (writeErr) => {
      if (writeErr) {
        console.error(writeErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const response = {
        status: "Success!",
        body: newData,
      };

      console.log(response);
      res.status(201).json(response);
    });
  });
});

// console logs 'App is listening at http://localhost:3001'
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
