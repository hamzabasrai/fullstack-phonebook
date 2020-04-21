require("dotenv").config();
const path = require("path");
const express = require("express");

// Middleware
const morgan = require("morgan");
const cors = require("cors");
const errorHandler = require("./error");
morgan.token("body", (req, res) => JSON.stringify(req.body));

// Models
const Person = require("./models/person");

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generateId = () => Math.floor(Math.random() * 100000);

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, "../phonebook-ui/build")));

app.get("/info", (req, res) => {
  const date = new Date();
  const html = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date.toDateString()} ${date.toTimeString()}</p>
  `;

  res.send(html);
});

app.get("/api/persons", (req, res, next) => {
  Person.find()
    .then((result) => {
      console.log(result);
      res.json(result);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (req, res, next) => {
  const body = req.body;

  if (!body.name) {
    return res.status(400).send({ error: "Name field is required" });
  } else if (!body.number) {
    return res.status(400).send({ error: "Number field is required" });
  }

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

app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    res.json(person);
  } else {
    return res.status(404).send({ error: "Person does not exist" });
  }
});

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
