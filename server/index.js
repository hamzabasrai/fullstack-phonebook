require("dotenv").config();
const path = require("path");
const express = require("express");

// Middleware
const logger = require("morgan");
const cors = require("cors");
const errorHandler = require("./error");
logger.token("body", (req, res) => JSON.stringify(req.body));

// Models
const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  logger(":method :url :status :res[content-length] - :response-time ms :body")
);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../phonebook-ui/build")));

// GET Endpoints
app.get("/info", (req, res) => {
  Person.find().then((result) => {
    const size = result.length;
    const date = new Date();
    const html = `
      <p>Phonebook has info for ${size} ${size > 1 ? "people" : "person"}</p>
      <p>${date.toDateString()} ${date.toTimeString()}</p>
    `;
    res.send(html);
  });
});

app.get("/api/persons", (req, res, next) => {
  Person.find()
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        return res.status(404).send({ error: "Person does not exist" });
      }
    })
    .catch((error) => next(error));
});

// POST Endpoints
app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => {
      res.json(savedPerson);
    })
    .catch((error) => next(error));
});

// PUT Endpoints
app.put("/api/persons/:id", (req, res, next) => {
  const body = req.body;

  // Note - This is a regular JS object not a Mongoose Model
  const person = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

// DELETE Endpoints
app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// All remaining requests return the React app, so it can handle routing.
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../phonebook-ui/build", "index.html"));
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
